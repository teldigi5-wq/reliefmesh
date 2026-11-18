import '../core/network/api_client.dart';
import '../models/incident.dart';
import '../models/volunteer.dart';

class IncidentService {
  IncidentService(this._api);
  final ApiClient _api;

  Future<List<Incident>> list() async {
    final data = await _api.get('/api/incidents') as List<dynamic>;
    return data.cast<Map<String, dynamic>>().map(Incident.fromJson).toList(growable: false);
  }

  Future<Incident> getById(String id) async {
    final data = await _api.get('/api/incidents/$id') as Map<String, dynamic>;
    return Incident.fromJson(data);
  }

  Future<Incident> create({
    required String title,
    required String description,
    required String category,
    required String severity,
    required double latitude,
    required double longitude,
    String? address,
  }) async {
    final data = await _api.post('/api/incidents', body: {
      'title': title.trim(),
      'description': description.trim(),
      'category': category,
      'severity': severity,
      'latitude': latitude,
      'longitude': longitude,
      if (address != null && address.trim().isNotEmpty) 'address': address.trim(),
    }) as Map<String, dynamic>;
    return Incident.fromJson(data);
  }

  Future<Incident> transitionStatus(String incidentId, String toStatus, {String? note}) async {
    final data = await _api.post('/api/incidents/$incidentId/status', body: {
      'toStatus': toStatus,
      if (note != null && note.trim().isNotEmpty) 'note': note.trim(),
    }) as Map<String, dynamic>;
    return Incident.fromJson(data);
  }

  Future<List<Volunteer>> volunteers() async {
    final data = await _api.get('/api/volunteers') as List<dynamic>;
    return data.cast<Map<String, dynamic>>().map(Volunteer.fromJson).toList(growable: false);
  }

  Future<void> assignResponder(String incidentId, String volunteerId) async {
    await _api.post('/api/incidents/$incidentId/assign', body: {'volunteerId': volunteerId});
  }
}
