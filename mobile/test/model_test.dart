import 'package:flutter_test/flutter_test.dart';
import 'package:reliefmesh/core/config/app_config.dart';
import 'package:reliefmesh/models/incident.dart';

void main() {
  test('production API URL is normalized and secure', () {
    expect(AppConfig.normalizedBaseUrl, startsWith('https://'));
    expect(AppConfig.normalizedBaseUrl, isNot(endsWith('/')));
  });

  test('incident API payload parses without losing coordinates', () {
    final incident = Incident.fromJson({
      'id': 'incident_1',
      'title': 'Flood warning',
      'description': 'Water is rising near the main road.',
      'category': 'FLOOD',
      'severity': 'HIGH',
      'status': 'REPORTED',
      'latitude': 6.9271,
      'longitude': 79.8612,
      'createdAt': '2026-11-18T08:00:00.000Z',
    });

    expect(incident.latitude, 6.9271);
    expect(incident.longitude, 79.8612);
    expect(Incident.readable(incident.category), 'Flood');
    expect(Incident.readable('UNDER_REVIEW'), 'Under Review');
  });
}
