import 'dart:io';

import '../core/network/api_client.dart';
import '../models/app_notification.dart';
import 'push_notification_manager.dart';

class AppNotificationService {
  AppNotificationService(this._api, {PushNotificationManager? push})
      : _push = push ?? PushNotificationManager();

  final ApiClient _api;
  final PushNotificationManager _push;
  final Set<String> _seen = {};
  bool _hasLoadedOnce = false;

  Future<void> initialize() => _push.initialize(registerToken: registerToken);
  Stream<String> get incidentOpened => _push.incidentOpened;
  String? takePendingIncidentId() => _push.takePendingIncidentId();

  Future<void> registerToken(String token) async {
    await _api.post('/api/push-tokens', body: {
      'token': token,
      'platform': Platform.isIOS ? 'IOS' : 'ANDROID',
    });
  }

  Future<({List<AppNotification> notifications, int unreadCount})> list() async {
    final data = await _api.get('/api/notifications') as Map<String, dynamic>;
    final notifications = (data['notifications'] as List<dynamic>)
        .cast<Map<String, dynamic>>()
        .map(AppNotification.fromJson)
        .toList(growable: false);

    if (_hasLoadedOnce) {
      for (final item in notifications.where((item) => !item.isRead && !_seen.contains(item.id))) {
        await _push.show(title: item.title, body: item.message, incidentId: item.relatedIncidentId);
      }
    }
    _seen.addAll(notifications.map((item) => item.id));
    _hasLoadedOnce = true;
    return (notifications: notifications, unreadCount: data['unreadCount'] as int);
  }

  Future<void> markRead(String id) => _api.post('/api/notifications/$id/read');
  Future<void> markAllRead() => _api.post('/api/notifications/read-all');

  Future<void> unregister() async {
    final token = _push.token;
    if (token != null) await _api.delete('/api/push-tokens', body: {'token': token});
  }

  Future<void> dispose() => _push.dispose();
}
