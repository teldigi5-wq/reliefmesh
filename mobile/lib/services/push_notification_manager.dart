import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../core/config/push_config.dart';

@pragma('vm:entry-point')
Future<void> reliefMeshBackgroundMessageHandler(RemoteMessage message) async {
  if (PushConfig.isConfigured && Firebase.apps.isEmpty) {
    await Firebase.initializeApp(options: PushConfig.options);
  }
}

class PushNotificationManager {
  final FlutterLocalNotificationsPlugin _local = FlutterLocalNotificationsPlugin();
  StreamSubscription<RemoteMessage>? _foregroundSubscription;
  StreamSubscription<RemoteMessage>? _openedSubscription;
  StreamSubscription<String>? _tokenSubscription;
  bool _initialized = false;
  String? _currentToken;

  String? get token => _currentToken;

  Future<void> initialize({
    required Future<void> Function(String token) registerToken,
    void Function(String incidentId)? onIncidentOpened,
  }) async {
    if (_initialized) {
      if (_currentToken != null) {
        try {
          await registerToken(_currentToken!);
        } catch (_) {
          // In-app notifications still work; registration retries next session.
        }
      }
      return;
    }
    _initialized = true;

    await _local.initialize(
      const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(),
      ),
      onDidReceiveNotificationResponse: (response) {
        final incidentId = response.payload;
        if (incidentId != null && incidentId.isNotEmpty) onIncidentOpened?.call(incidentId);
      },
    );

    final android = _local.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    await android?.createNotificationChannel(
      const AndroidNotificationChannel(
        'reliefmesh_alerts',
        'ReliefMesh emergency alerts',
        description: 'Incident assignments, emergency updates and response status changes.',
        importance: Importance.max,
        enableVibration: true,
      ),
    );
    await android?.requestNotificationsPermission();
    await _local.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );

    if (!PushConfig.isConfigured) return;

    if (Firebase.apps.isEmpty) await Firebase.initializeApp(options: PushConfig.options);
    final messaging = FirebaseMessaging.instance;
    await messaging.requestPermission(alert: true, badge: true, sound: true, provisional: false);
    await messaging.setForegroundNotificationPresentationOptions(alert: true, badge: true, sound: true);

    final token = await messaging.getToken();
    if (token != null) {
      _currentToken = token;
      try {
        await registerToken(token);
      } catch (_) {
        // Authentication must not fail because push registration is unavailable.
      }
    }
    _tokenSubscription = messaging.onTokenRefresh.listen((token) async {
      _currentToken = token;
      try {
        await registerToken(token);
      } catch (_) {
        // A later app session will retry registration with the current token.
      }
    });
    _foregroundSubscription = FirebaseMessaging.onMessage.listen((message) {
      show(
        title: message.notification?.title ?? message.data['title']?.toString() ?? 'ReliefMesh update',
        body: message.notification?.body ?? message.data['message']?.toString() ?? 'Open ReliefMesh for details.',
        incidentId: message.data['incidentId']?.toString(),
      );
    });
    _openedSubscription = FirebaseMessaging.onMessageOpenedApp.listen((message) {
      final incidentId = message.data['incidentId']?.toString();
      if (incidentId != null && incidentId.isNotEmpty) onIncidentOpened?.call(incidentId);
    });
  }

  Future<void> show({required String title, required String body, String? incidentId}) {
    return _local.show(
      Object.hash(title, body, incidentId),
      title,
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'reliefmesh_alerts',
          'ReliefMesh emergency alerts',
          channelDescription: 'Incident assignments, emergency updates and response status changes.',
          importance: Importance.max,
          priority: Priority.high,
          category: AndroidNotificationCategory.alarm,
        ),
        iOS: DarwinNotificationDetails(presentAlert: true, presentBadge: true, presentSound: true),
      ),
      payload: incidentId,
    );
  }

  Future<void> dispose() async {
    await _foregroundSubscription?.cancel();
    await _openedSubscription?.cancel();
    await _tokenSubscription?.cancel();
  }
}
