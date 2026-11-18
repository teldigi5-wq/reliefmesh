import 'package:flutter/foundation.dart';

import '../core/network/api_client.dart';
import '../models/incident.dart';
import '../models/user_session.dart';
import '../services/auth_service.dart';
import '../services/incident_service.dart';

class AppController extends ChangeNotifier {
  AppController({required AuthService authService, required this.incidentService})
      : _authService = authService;

  final AuthService _authService;
  final IncidentService incidentService;
  bool isBootstrapping = true;
  bool isAuthenticating = false;
  UserSession? session;
  List<Incident> incidents = const [];

  Future<void> bootstrap() async {
    session = await _authService.restore();
    isBootstrapping = false;
    notifyListeners();
    if (session != null) {
      try {
        await refreshIncidents(silent: true);
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
      await refreshIncidents(silent: true);
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
      await refreshIncidents(silent: true);
    } finally {
      isAuthenticating = false;
      notifyListeners();
    }
  }

  Future<void> refreshIncidents({bool silent = false}) async {
    incidents = await incidentService.list();
    if (!silent) notifyListeners();
  }

  Future<void> signOut() async {
    await _authService.signOut();
    session = null;
    incidents = const [];
    notifyListeners();
  }
}
