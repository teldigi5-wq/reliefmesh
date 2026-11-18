import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../config/app_config.dart';

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});
  final String message;
  final int? statusCode;
  @override
  String toString() => message;
}

class ApiClient {
  ApiClient({http.Client? client}) : _client = client ?? http.Client();
  final http.Client _client;
  String? _token;

  set token(String? value) => _token = value;
  Future<dynamic> get(String path) => _send('GET', path);
  Future<dynamic> post(String path, {Map<String, dynamic>? body}) => _send('POST', path, body: body);

  Future<dynamic> _send(String method, String path, {Map<String, dynamic>? body}) async {
    final request = http.Request(method, Uri.parse('${AppConfig.normalizedBaseUrl}$path'))
      ..headers.addAll({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      });
    if (body != null) request.body = jsonEncode(body);
    try {
      final streamed = await _client.send(request).timeout(const Duration(seconds: 25));
      final response = await http.Response.fromStream(streamed);
      final decoded = response.body.isEmpty ? null : jsonDecode(response.body);
      if (response.statusCode < 200 || response.statusCode >= 300) {
        final message = decoded is Map<String, dynamic>
            ? decoded['error']?.toString() ?? 'Request failed.'
            : 'Request failed.';
        throw ApiException(message, statusCode: response.statusCode);
      }
      return decoded;
    } on ApiException {
      rethrow;
    } on TimeoutException {
      throw const ApiException('The server took too long to respond. Check your connection and try again.');
    } on SocketException {
      throw const ApiException('ReliefMesh could not reach the network. Check your connection and try again.');
    } on FormatException {
      throw const ApiException('The server returned an unexpected response.');
    } on http.ClientException {
      throw const ApiException('ReliefMesh could not connect to the server.');
    }
  }
}
