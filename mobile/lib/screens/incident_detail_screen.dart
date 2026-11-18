import 'package:intl/intl.dart';
import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../controllers/app_controller.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../models/incident.dart';
import '../models/volunteer.dart';

class IncidentDetailScreen extends StatefulWidget {
  const IncidentDetailScreen({super.key, required this.incident, required this.controller});
  final Incident incident;
  final AppController controller;
  @override
  State<IncidentDetailScreen> createState() => _IncidentDetailScreenState();
}

class _IncidentDetailScreenState extends State<IncidentDetailScreen> {
  late Incident _incident = widget.incident;
  bool _working = false;

  Future<void> _openMap() async {
    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=${_incident.latitude},${_incident.longitude}');
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication) && mounted) {
      _message('Could not open the maps app.');
    }
  }

  Future<void> _transition(String status) async {
    setState(() => _working = true);
    try {
      final updated = await widget.controller.incidentService.transitionStatus(_incident.id, status);
      await Future.wait([widget.controller.refreshIncidents(), widget.controller.refreshNotifications()]);
      if (mounted) {
        setState(() => _incident = updated);
        _message('Incident moved to ${Incident.readable(status)}.');
      }
    } on ApiException catch (error) {
      if (mounted) _message(error.message);
    } finally {
      if (mounted) setState(() => _working = false);
    }
  }

  Future<void> _assign() async {
    setState(() => _working = true);
    try {
      final volunteers = await widget.controller.incidentService.volunteers();
      if (!mounted) return;
      final selected = await showModalBottomSheet<Volunteer>(
        context: context,
        isScrollControlled: true,
        builder: (context) => _VolunteerSheet(volunteers: volunteers.where((item) => item.isAvailable).toList()),
      );
      if (selected == null) return;
      await widget.controller.incidentService.assignResponder(_incident.id, selected.id);
      final refreshed = await widget.controller.incidentService.getById(_incident.id);
      await Future.wait([widget.controller.refreshIncidents(), widget.controller.refreshNotifications()]);
      if (mounted) {
        setState(() => _incident = refreshed);
        _message('${selected.fullName} assigned successfully.');
      }
    } on ApiException catch (error) {
      if (mounted) _message(error.message);
    } finally {
      if (mounted) setState(() => _working = false);
    }
  }

  void _message(String value) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(value)));

  @override
  Widget build(BuildContext context) {
    final role = widget.controller.session!.role;
    final isOperator = role == 'ADMIN' || role == 'OPERATOR';
    final isResponder = role == 'RESPONDER';
    return Scaffold(
      appBar: AppBar(title: const Text('Incident details'), backgroundColor: Colors.transparent),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
        children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF142B3F), Color(0xFF0D1B2A)]),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: AppColors.line),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                _Pill(label: Incident.readable(_incident.severity), color: _incident.severity == 'CRITICAL' ? AppColors.coral : AppColors.gold),
                const SizedBox(width: 8),
                _Pill(label: Incident.readable(_incident.status), color: AppColors.teal),
              ]),
              const SizedBox(height: 20),
              Text(_incident.title, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 10),
              Text(_incident.description, style: const TextStyle(color: AppColors.muted, height: 1.55)),
            ]),
          ),
          const SizedBox(height: 18),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(children: [
                _DetailRow(icon: Icons.category_outlined, label: 'Category', value: Incident.readable(_incident.category)),
                const Divider(height: 28, color: AppColors.line),
                _DetailRow(icon: Icons.schedule_rounded, label: 'Reported', value: DateFormat('EEEE, MMM d • HH:mm').format(_incident.createdAt.toLocal())),
                if (_incident.address != null && _incident.address!.isNotEmpty) ...[
                  const Divider(height: 28, color: AppColors.line),
                  _DetailRow(icon: Icons.signpost_outlined, label: 'Landmark', value: _incident.address!),
                ],
                const Divider(height: 28, color: AppColors.line),
                _DetailRow(icon: Icons.gps_fixed_rounded, label: 'Coordinates', value: '${_incident.latitude.toStringAsFixed(5)}, ${_incident.longitude.toStringAsFixed(5)}'),
              ]),
            ),
          ),
          if (isOperator || isResponder) ...[
            const SizedBox(height: 18),
            _RoleActions(
              role: role,
              status: _incident.status,
              working: _working,
              transition: _transition,
              assign: _assign,
            ),
          ],
          const SizedBox(height: 18),
          FilledButton.tonalIcon(onPressed: _openMap, icon: const Icon(Icons.map_outlined), label: const Text('Open incident location')),
          const SizedBox(height: 14),
          Text('Reference: ${_incident.id}', textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted, fontSize: 11)),
        ],
      ),
    );
  }
}

class _RoleActions extends StatelessWidget {
  const _RoleActions({required this.role, required this.status, required this.working, required this.transition, required this.assign});
  final String role;
  final String status;
  final bool working;
  final Future<void> Function(String) transition;
  final Future<void> Function() assign;

  @override
  Widget build(BuildContext context) {
    final operator = role == 'ADMIN' || role == 'OPERATOR';
    final actions = <Widget>[];
    if (operator && status == 'REPORTED') {
      actions.add(OutlinedButton.icon(onPressed: working ? null : () => transition('UNDER_REVIEW'), icon: const Icon(Icons.manage_search_rounded), label: const Text('Start review')));
      actions.add(FilledButton.icon(onPressed: working ? null : () => transition('VERIFIED'), icon: const Icon(Icons.verified_rounded), label: const Text('Verify incident')));
    }
    if (operator && status == 'UNDER_REVIEW') {
      actions.add(FilledButton.icon(onPressed: working ? null : () => transition('VERIFIED'), icon: const Icon(Icons.verified_rounded), label: const Text('Verify incident')));
    }
    if (operator && status == 'VERIFIED') {
      actions.add(FilledButton.icon(onPressed: working ? null : assign, icon: const Icon(Icons.assignment_ind_rounded), label: const Text('Assign responder')));
    }
    if (operator && status == 'RESOLVED') {
      actions.add(FilledButton.icon(onPressed: working ? null : () => transition('CLOSED'), icon: const Icon(Icons.task_alt_rounded), label: const Text('Close incident')));
    }
    if (role == 'RESPONDER' && status == 'ASSIGNED') {
      actions.add(FilledButton.icon(onPressed: working ? null : () => transition('RESPONDING'), icon: const Icon(Icons.emergency_share_rounded), label: const Text('Accept and start response')));
    }
    if (role == 'RESPONDER' && status == 'RESPONDING') {
      actions.add(FilledButton.icon(onPressed: working ? null : () => transition('RESOLVED'), icon: const Icon(Icons.task_alt_rounded), label: const Text('Mark incident resolved')));
    }
    if (actions.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [Icon(operator ? Icons.admin_panel_settings_rounded : Icons.health_and_safety_rounded, color: AppColors.teal), const SizedBox(width: 9), Text(operator ? 'Operations controls' : 'Responder controls', style: Theme.of(context).textTheme.titleMedium)]),
          const SizedBox(height: 15),
          ...actions.map((action) => Padding(padding: const EdgeInsets.only(bottom: 9), child: action)),
          if (working) const LinearProgressIndicator(),
        ]),
      ),
    );
  }
}

class _VolunteerSheet extends StatelessWidget {
  const _VolunteerSheet({required this.volunteers});
  final List<Volunteer> volunteers;
  @override
  Widget build(BuildContext context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Assign a responder', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 6),
            const Text('Available responder profiles from the live platform.', style: TextStyle(color: AppColors.muted)),
            const SizedBox(height: 14),
            if (volunteers.isEmpty)
              const Padding(padding: EdgeInsets.symmetric(vertical: 30), child: Center(child: Text('No responders are currently available.')))
            else
              ...volunteers.map((item) => Card(
                    child: ListTile(
                      onTap: () => Navigator.pop(context, item),
                      leading: const CircleAvatar(child: Icon(Icons.person_rounded)),
                      title: Text(item.fullName),
                      subtitle: Text(item.skills.isEmpty ? item.email : item.skills.join(' • ')),
                      trailing: const Icon(Icons.add_circle_rounded, color: AppColors.teal),
                    ),
                  )),
          ]),
        ),
      );
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label, required this.color});
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
        decoration: BoxDecoration(color: color.withValues(alpha: 0.13), borderRadius: BorderRadius.circular(30), border: Border.all(color: color.withValues(alpha: 0.35))),
        child: Text(label.toUpperCase(), style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 0.8)),
      );
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) => Row(children: [
        Icon(icon, color: AppColors.teal, size: 21),
        const SizedBox(width: 13),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: const TextStyle(color: AppColors.muted, fontSize: 11)), const SizedBox(height: 3), Text(value, style: const TextStyle(fontWeight: FontWeight.w700))])),
      ]);
}
