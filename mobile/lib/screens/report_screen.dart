import 'package:material_ui/material_ui.dart';
import 'package:geolocator/geolocator.dart';

import '../controllers/app_controller.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../services/location_service.dart';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key, required this.controller, required this.onCreated});
  final AppController controller;
  final VoidCallback onCreated;
  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  static const categories = ['FLOOD', 'LANDSLIDE', 'FIRE', 'MEDICAL_EMERGENCY', 'ROAD_ACCIDENT', 'MISSING_PERSON', 'INFRASTRUCTURE_DAMAGE', 'OTHER'];
  static const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _description = TextEditingController();
  final _address = TextEditingController();
  final _locationService = LocationService();
  String _category = 'FLOOD';
  String _severity = 'MEDIUM';
  Position? _position;
  bool _locating = false;
  bool _submitting = false;

  @override
  void dispose() {
    _title.dispose();
    _description.dispose();
    _address.dispose();
    super.dispose();
  }

  Future<void> _locate() async {
    setState(() => _locating = true);
    try {
      final position = await _locationService.current();
      if (mounted) setState(() => _position = position);
    } on LocationException catch (error) {
      if (mounted) _message(error.message);
    } finally {
      if (mounted) setState(() => _locating = false);
    }
  }

  Future<void> _submit() async {
    if (!_form.currentState!.validate()) return;
    if (_position == null) {
      await _locate();
      if (_position == null) return;
    }
    setState(() => _submitting = true);
    try {
      await widget.controller.incidentService.create(
        title: _title.text,
        description: _description.text,
        category: _category,
        severity: _severity,
        latitude: _position!.latitude,
        longitude: _position!.longitude,
        address: _address.text,
      );
      await widget.controller.refreshIncidents();
      _form.currentState!.reset();
      _title.clear();
      _description.clear();
      _address.clear();
      if (mounted) {
        _message('Report submitted to the live ReliefMesh response queue.');
        widget.onCreated();
      }
    } on ApiException catch (error) {
      if (mounted) _message(error.message);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _message(String value) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(value)));

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Form(
        key: _form,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 30),
          children: [
            Text('Report an incident', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 7),
            const Text('This creates a real record for coordinators and responders.', style: TextStyle(color: AppColors.muted)),
            const SizedBox(height: 24),
            TextFormField(
              controller: _title,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(labelText: 'Short title', prefixIcon: Icon(Icons.title_rounded)),
              validator: (value) => (value?.trim().length ?? 0) < 3 ? 'Use at least 3 characters' : null,
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _description,
              minLines: 4,
              maxLines: 7,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(labelText: 'What is happening?', alignLabelWithHint: true),
              validator: (value) => (value?.trim().length ?? 0) < 10 ? 'Add at least 10 characters so responders understand the situation' : null,
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              initialValue: _category,
              decoration: const InputDecoration(labelText: 'Incident type', prefixIcon: Icon(Icons.category_outlined)),
              items: categories.map((value) => DropdownMenuItem(value: value, child: Text(_readable(value)))).toList(),
              onChanged: (value) => setState(() => _category = value!),
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              initialValue: _severity,
              decoration: const InputDecoration(labelText: 'Severity', prefixIcon: Icon(Icons.warning_amber_rounded)),
              items: severities.map((value) => DropdownMenuItem(value: value, child: Text(_readable(value)))).toList(),
              onChanged: (value) => setState(() => _severity = value!),
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _address,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(labelText: 'Address or landmark (optional)', prefixIcon: Icon(Icons.signpost_outlined)),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(children: [
                  Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(color: AppColors.teal.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(14)),
                    child: Icon(_position == null ? Icons.my_location_rounded : Icons.gps_fixed_rounded, color: AppColors.teal),
                  ),
                  const SizedBox(width: 13),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(_position == null ? 'Precise location required' : 'GPS location captured', style: const TextStyle(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 3),
                      Text(_position == null ? 'Only shared when you submit' : '${_position!.latitude.toStringAsFixed(5)}, ${_position!.longitude.toStringAsFixed(5)}', style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                    ]),
                  ),
                  TextButton(onPressed: _locating ? null : _locate, child: Text(_locating ? 'Locating…' : 'Capture')),
                ]),
              ),
            ),
            const SizedBox(height: 18),
            FilledButton.icon(
              onPressed: _submitting ? null : _submit,
              icon: _submitting ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.send_rounded),
              label: const Text('Submit live report'),
            ),
            const SizedBox(height: 12),
            const Text('Reports are rate-limited and tied to your authenticated account to protect the response network.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.muted, fontSize: 11, height: 1.4)),
          ],
        ),
      ),
    );
  }

  static String _readable(String value) => value.split('_').map((word) => '${word[0]}${word.substring(1).toLowerCase()}').join(' ');
}
