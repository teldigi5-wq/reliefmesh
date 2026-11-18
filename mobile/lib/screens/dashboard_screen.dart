import 'package:material_ui/material_ui.dart';

import '../controllers/app_controller.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../models/incident.dart';
import '../services/location_service.dart';
import '../widgets/brand_mark.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key, required this.controller, required this.openReport});
  final AppController controller;
  final VoidCallback openReport;
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _location = LocationService();
  bool _sendingSos = false;

  Future<void> _sendSos() async {
    final type = await showModalBottomSheet<_SosType>(
      context: context,
      isScrollControlled: true,
      builder: (context) => const _SosSheet(),
    );
    if (type == null || !mounted) return;
    setState(() => _sendingSos = true);
    try {
      final position = await _location.current();
      final incident = await widget.controller.incidentService.create(
        title: 'Emergency SOS — ${type.label}',
        description: 'Urgent ${type.label.toLowerCase()} assistance requested from the ReliefMesh mobile app.',
        category: type.category,
        severity: 'CRITICAL',
        latitude: position.latitude,
        longitude: position.longitude,
      );
      await widget.controller.refreshIncidents();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('SOS ${incident.id.substring(0, 8)} sent. Your live location was attached.')),
        );
      }
    } on LocationException catch (error) {
      if (mounted) _message(error.message);
    } on ApiException catch (error) {
      if (mounted) _message(error.message);
    } finally {
      if (mounted) setState(() => _sendingSos = false);
    }
  }

  void _message(String value) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(value)));

  @override
  Widget build(BuildContext context) {
    final session = widget.controller.session!;
    final name = session.fullName?.split(' ').first ?? 'there';
    final active = widget.controller.incidents.where((item) => !{'RESOLVED', 'CLOSED'}.contains(item.status)).length;
    final critical = widget.controller.incidents.where((item) => item.severity == 'CRITICAL').length;
    final latest = widget.controller.incidents.take(3).toList();

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: widget.controller.refreshIncidents,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 30),
          children: [
            Row(
              children: [
                const BrandMark(size: 48),
                const SizedBox(width: 12),
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('RELIEFMESH', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.8)), Text('LIVE RESPONSE NETWORK', style: TextStyle(color: AppColors.teal, fontSize: 10, letterSpacing: 1.2))])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                  decoration: BoxDecoration(color: AppColors.teal.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(20)),
                  child: const Row(children: [Icon(Icons.circle, color: AppColors.teal, size: 8), SizedBox(width: 6), Text('ONLINE', style: TextStyle(color: AppColors.teal, fontSize: 11, fontWeight: FontWeight.w800))]),
                ),
              ],
            ),
            const SizedBox(height: 30),
            Text('Stay ready, $name.', style: Theme.of(context).textTheme.displaySmall),
            const SizedBox(height: 8),
            const Text('Report danger, share precise location and follow the response in real time.', style: TextStyle(color: AppColors.muted, height: 1.45)),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF351822), Color(0xFF142033)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppColors.coral.withValues(alpha: 0.45)),
                boxShadow: [BoxShadow(color: AppColors.coral.withValues(alpha: 0.12), blurRadius: 30, offset: const Offset(0, 12))],
              ),
              child: Column(
                children: [
                  const Row(children: [Icon(Icons.emergency_share_rounded, color: AppColors.coral), SizedBox(width: 9), Text('EMERGENCY SIGNAL', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1.4))]),
                  const SizedBox(height: 20),
                  GestureDetector(
                    onLongPress: _sendingSos ? null : _sendSos,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      width: 168,
                      height: 168,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const RadialGradient(colors: [AppColors.coralSoft, AppColors.coral]),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.7), width: 3),
                        boxShadow: [BoxShadow(color: AppColors.coral.withValues(alpha: 0.38), blurRadius: 28, spreadRadius: 7)],
                      ),
                      child: _sendingSos
                          ? const Center(child: CircularProgressIndicator(color: Colors.white))
                          : const Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.sos_rounded, size: 52, color: Colors.white), SizedBox(height: 3), Text('HOLD TO SEND', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.2))]),
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text('Press and hold • Your GPS location is attached', style: TextStyle(color: AppColors.muted, fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Expanded(child: _Metric(label: 'Active reports', value: '$active', icon: Icons.radar_rounded, color: AppColors.teal)),
                const SizedBox(width: 12),
                Expanded(child: _Metric(label: 'Critical', value: '$critical', icon: Icons.warning_amber_rounded, color: AppColors.gold)),
              ],
            ),
            const SizedBox(height: 18),
            FilledButton.tonalIcon(onPressed: widget.openReport, icon: const Icon(Icons.add_location_alt_rounded), label: const Text('Create a detailed incident report')),
            const SizedBox(height: 26),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Latest activity', style: Theme.of(context).textTheme.titleLarge), Text('${widget.controller.incidents.length} total', style: const TextStyle(color: AppColors.muted))]),
            const SizedBox(height: 12),
            if (latest.isEmpty)
              const Card(child: Padding(padding: EdgeInsets.all(22), child: Text('No reports yet. Use the report button when you need help.', style: TextStyle(color: AppColors.muted))))
            else
              ...latest.map((incident) => _ActivityRow(incident: incident)),
          ],
        ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value, required this.icon, required this.color});
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  @override
  Widget build(BuildContext context) => Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(icon, color: color), const SizedBox(height: 16), Text(value, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900)), Text(label, style: const TextStyle(color: AppColors.muted, fontSize: 12))]),
        ),
      );
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow({required this.incident});
  final Incident incident;
  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: CircleAvatar(backgroundColor: AppColors.coral.withValues(alpha: 0.12), child: const Icon(Icons.location_on_rounded, color: AppColors.coral)),
          title: Text(incident.title, maxLines: 1, overflow: TextOverflow.ellipsis),
          subtitle: Text(Incident.readable(incident.status), style: const TextStyle(color: AppColors.muted)),
          trailing: const Icon(Icons.chevron_right_rounded),
        ),
      );
}

class _SosType {
  const _SosType(this.label, this.category, this.icon);
  final String label;
  final String category;
  final IconData icon;
}

class _SosSheet extends StatelessWidget {
  const _SosSheet();
  static const types = [
    _SosType('Medical', 'MEDICAL_EMERGENCY', Icons.medical_services_rounded),
    _SosType('Fire', 'FIRE', Icons.local_fire_department_rounded),
    _SosType('Flood', 'FLOOD', Icons.flood_rounded),
    _SosType('Immediate danger', 'OTHER', Icons.crisis_alert_rounded),
  ];
  @override
  Widget build(BuildContext context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 14, 20, 26),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AppColors.line, borderRadius: BorderRadius.circular(4)))),
            const SizedBox(height: 22),
            Text('What kind of help?', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 7),
            const Text('Selecting a type sends a critical incident with your live GPS position.', style: TextStyle(color: AppColors.muted)),
            const SizedBox(height: 16),
            ...types.map((type) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: FilledButton.tonalIcon(onPressed: () => Navigator.pop(context, type), icon: Icon(type.icon), label: Text(type.label)),
                )),
          ]),
        ),
      );
}
