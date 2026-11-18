import 'package:flutter/foundation.dart';

import '../core/network/api_client.dart';
import '../models/incident.dart';
import '../models/app_notification.dart';
import '../models/user_session.dart';
import '../services/app_notification_service.dart';
import '../services/auth_service.dart';
import '../services/incident_service.dart';

class AppController extends ChangeNotifier {
  AppController({required AuthService authService, required this.incidentService, required this.notificationService})
      : _authService = authService;

  final AuthService _authService;
  final IncidentService incidentService;
  final AppNotificationService notificationService;
  bool isBootstrapping = true;
  bool isAuthenticating = false;
  UserSession? session;
  List<Incident> incidents = const [];
  List<AppNotification> notifications = const [];
  int unreadNotifications = 0;

  Future<void> bootstrap() async {
    session = await _authService.restore();
    isBootstrapping = false;
    notifyListeners();
    if (session != null) {
      try {
        await notificationService.initialize();
        await Future.wait([refreshIncidents(silent: true), refreshNotifications(silent: true)]);
      } on ApiException catch (error) {
        if (error.statusCode == 401) await signOut();
      }
    }
  }

  Future<void> signIn(String email, String password) async {
    isAuthenticating = true;
    notifyListeners();
    try {
      session = await _authService.signIn(email, password);
      await notificationService.initialize();
      await Future.wait([refreshIncidents(silent: true), refreshNotifications(silent: true)]);
    } finally {
      isAuthenticating = false;
      notifyListeners();
    }
  }

  Future<void> register({required String fullName, required String email, required String password, String? phone}) async {
    isAuthenticating = true;
    notifyListeners();
    try {
      session = await _authService.register(fullName: fullName, email: email, password: password, phone: phone);
      await notificationService.initialize();
      await Future.wait([refreshIncidents(silent: true), refreshNotifications(silent: true)]);
    } finally {
      isAuthenticating = false;
      notifyListeners();
    }
  }

  Future<void> refreshIncidents({bool silent = false}) async {
    incidents = await incidentService.list();
    if (!silent) notifyListeners();
  }

  Future<void> refreshNotifications({bool silent = false}) async {
    final result = await notificationService.list();
    notifications = result.notifications;
    unreadNotifications = result.unreadCount;
    if (!silent) notifyListeners();
  }

  Future<void> markNotificationRead(String id) async {
    await notificationService.markRead(id);
    await refreshNotifications();
  }

  Future<void> markAllNotificationsRead() async {
    await notificationService.markAllRead();
    await refreshNotifications();
  }

  Future<void> signOut() async {
    try {
      await notificationService.unregister();
    } catch (_) {
      // Signing out must still clear the local session if token removal fails.
    }
    await _authService.signOut();
    session = null;
    incidents = const [];
    notifications = const [];
    unreadNotifications = 0;
    notifyListeners();
  }
}
