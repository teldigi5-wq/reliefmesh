import 'package:material_ui/material_ui.dart';
import 'package:intl/intl.dart';

import '../controllers/app_controller.dart';
import '../core/theme/app_theme.dart';
import '../models/incident.dart';
import 'incident_detail_screen.dart';

class IncidentsScreen extends StatelessWidget {
  const IncidentsScreen({super.key, required this.controller});
  final AppController controller;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: controller.refreshIncidents,
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
              sliver: SliverToBoxAdapter(
                child: Row(children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Response activity', style: Theme.of(context).textTheme.headlineSmall), const SizedBox(height: 6), const Text('Pull down to sync live status', style: TextStyle(color: AppColors.muted))])),
                  IconButton.filledTonal(onPressed: controller.refreshIncidents, icon: const Icon(Icons.sync_rounded)),
                ]),
              ),
            ),
            if (controller.incidents.isEmpty)
              const SliverFillRemaining(
                hasScrollBody: false,
                child: Center(child: Padding(padding: EdgeInsets.all(32), child: Text('No incident reports yet.', style: TextStyle(color: AppColors.muted)))),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 28),
                sliver: SliverList.builder(
                  itemCount: controller.incidents.length,
                  itemBuilder: (context, index) => _IncidentCard(
                    incident: controller.incidents[index],
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => IncidentDetailScreen(incident: controller.incidents[index], controller: controller))),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _IncidentCard extends StatelessWidget {
  const _IncidentCard({required this.incident, required this.onTap});
  final Incident incident;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final color = switch (incident.severity) {
      'CRITICAL' => AppColors.coral,
      'HIGH' => AppColors.gold,
      'MEDIUM' => AppColors.teal,
      _ => AppColors.muted,
    };
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(17),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(width: 4, height: 68, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4))),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [Expanded(child: Text(incident.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800))), const SizedBox(width: 8), Text(Incident.readable(incident.severity), style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w800))]),
              const SizedBox(height: 7),
              Text(Incident.readable(incident.category), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
              const SizedBox(height: 11),
              Row(children: [const Icon(Icons.radio_button_checked, size: 14, color: AppColors.teal), const SizedBox(width: 6), Text(Incident.readable(incident.status), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)), const Spacer(), Text(DateFormat('MMM d, HH:mm').format(incident.createdAt.toLocal()), style: const TextStyle(color: AppColors.muted, fontSize: 11))]),
            ])),
          ]),
        ),
      ),
    );
  }
}
