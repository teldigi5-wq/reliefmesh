import 'package:material_ui/material_ui.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../core/theme/app_theme.dart';
import '../models/incident.dart';

class IncidentDetailScreen extends StatelessWidget {
  const IncidentDetailScreen({super.key, required this.incident});
  final Incident incident;

  Future<void> _openMap(BuildContext context) async {
    final uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=${incident.latitude},${incident.longitude}');
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication) && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not open the maps app.')));
    }
  }

  @override
  Widget build(BuildContext context) {
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
                _Pill(label: Incident.readable(incident.severity), color: incident.severity == 'CRITICAL' ? AppColors.coral : AppColors.gold),
                const SizedBox(width: 8),
                _Pill(label: Incident.readable(incident.status), color: AppColors.teal),
              ]),
              const SizedBox(height: 20),
              Text(incident.title, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 10),
              Text(incident.description, style: const TextStyle(color: AppColors.muted, height: 1.55)),
            ]),
          ),
          const SizedBox(height: 18),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(children: [
                _DetailRow(icon: Icons.category_outlined, label: 'Category', value: Incident.readable(incident.category)),
                const Divider(height: 28, color: AppColors.line),
                _DetailRow(icon: Icons.schedule_rounded, label: 'Reported', value: DateFormat('EEEE, MMM d • HH:mm').format(incident.createdAt.toLocal())),
                if (incident.address != null && incident.address!.isNotEmpty) ...[
                  const Divider(height: 28, color: AppColors.line),
                  _DetailRow(icon: Icons.signpost_outlined, label: 'Landmark', value: incident.address!),
                ],
                const Divider(height: 28, color: AppColors.line),
                _DetailRow(icon: Icons.gps_fixed_rounded, label: 'Coordinates', value: '${incident.latitude.toStringAsFixed(5)}, ${incident.longitude.toStringAsFixed(5)}'),
              ]),
            ),
          ),
          const SizedBox(height: 18),
          FilledButton.icon(onPressed: () => _openMap(context), icon: const Icon(Icons.map_outlined), label: const Text('Open incident location')),
          const SizedBox(height: 14),
          Text('Reference: ${incident.id}', textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted, fontSize: 11)),
        ],
      ),
    );
  }
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
