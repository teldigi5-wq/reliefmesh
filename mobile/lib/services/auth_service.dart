import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../core/network/api_client.dart';
import '../models/user_session.dart';

class AuthService {
  AuthService(this._api, {FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage(
          aOptions: AndroidOptions(encryptedSharedPreferences: true),
        );

  static const _tokenKey = 'reliefmesh_session_token';
  static const _profileKey = 'reliefmesh_session_profile';
  final ApiClient _api;
  final FlutterSecureStorage _storage;

  Future<UserSession?> restore() async {
    final values = await Future.wait([
      _storage.read(key: _tokenKey),
      _storage.read(key: _profileKey),
    ]);
    final token = values[0];
    final profile = values[1];
    if (token == null || token.isEmpty || profile == null) return null;
    _api.token = token;
    try {
      return UserSession.fromJson(jsonDecode(profile) as Map<String, dynamic>);
    } on FormatException {
      await signOut();
      return null;
    }
  }

  Future<UserSession> signIn(String email, String password) async {
    final data = await _api.post('/api/auth/login', body: {
      'email': email.trim().toLowerCase(),
      'password': password,
    }) as Map<String, dynamic>;
    final session = UserSession.fromJson(data);
    await _acceptSession(data['token'] as String, session);
    return session;
  }

  Future<UserSession> register({
    required String fullName,
    required String email,
    required String password,
    String? phone,
  }) async {
    final data = await _api.post('/api/auth/register', body: {
      'fullName': fullName.trim(),
      'email': email.trim().toLowerCase(),
      'password': password,
      if (phone != null && phone.trim().isNotEmpty) 'phone': phone.trim(),
    }) as Map<String, dynamic>;
    final session = UserSession(
      id: data['id'] as String,
      email: data['email'] as String,
      role: data['role'] as String,
      fullName: fullName.trim(),
      phone: phone?.trim(),
    );
    await _acceptSession(data['token'] as String, session);
    return session;
  }

  Future<void> _acceptSession(String token, UserSession session) async {
    _api.token = token;
    await Future.wait([
      _storage.write(key: _tokenKey, value: token),
      _storage.write(key: _profileKey, value: jsonEncode(session.toJson())),
    ]);
  }

  Future<void> signOut() async {
    _api.token = null;
    await Future.wait([
      _storage.delete(key: _tokenKey),
      _storage.delete(key: _profileKey),
    ]);
  }
}
