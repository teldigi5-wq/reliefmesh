import 'package:intl/intl.dart';
import 'package:material_ui/material_ui.dart';

import '../controllers/app_controller.dart';
import '../core/theme/app_theme.dart';
import '../models/app_notification.dart';
import 'incident_detail_screen.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key, required this.controller});
  final AppController controller;

  Future<void> _open(BuildContext context, AppNotification notification) async {
    if (!notification.isRead) await controller.markNotificationRead(notification.id);
    final incidentId = notification.relatedIncidentId;
    if (incidentId == null || !context.mounted) return;
    try {
      final incident = await controller.incidentService.getById(incidentId);
      if (context.mounted) {
        await Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => IncidentDetailScreen(incident: incident, controller: controller)),
        );
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('This incident is no longer available.')));
      }
    }
  }

  @override
  Widget build(BuildContext context) => SafeArea(
        child: RefreshIndicator(
          onRefresh: controller.refreshNotifications,
          child: CustomScrollView(slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 24, 12, 16),
              sliver: SliverToBoxAdapter(
                child: Row(children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Notifications', style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 5),
                    Text('${controller.unreadNotifications} unread alert${controller.unreadNotifications == 1 ? '' : 's'}', style: const TextStyle(color: AppColors.muted)),
                  ])),
                  if (controller.unreadNotifications > 0)
                    TextButton(onPressed: controller.markAllNotificationsRead, child: const Text('Mark all read')),
                ]),
              ),
            ),
            if (controller.notifications.isEmpty)
              const SliverFillRemaining(
                hasScrollBody: false,
                child: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.notifications_none_rounded, color: AppColors.muted, size: 52), SizedBox(height: 12), Text('No alerts yet', style: TextStyle(color: AppColors.muted))])),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 28),
                sliver: SliverList.builder(
                  itemCount: controller.notifications.length,
                  itemBuilder: (context, index) {
                    final item = controller.notifications[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      color: item.isRead ? AppColors.panel : AppColors.raised,
                      child: ListTile(
                        onTap: () => _open(context, item),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                        leading: CircleAvatar(
                          backgroundColor: (item.type == 'NEW_CRITICAL_INCIDENT' ? AppColors.coral : AppColors.teal).withValues(alpha: .14),
                          child: Icon(item.type == 'RESPONDER_ASSIGNED' ? Icons.assignment_ind_rounded : Icons.notifications_active_rounded, color: item.type == 'NEW_CRITICAL_INCIDENT' ? AppColors.coral : AppColors.teal),
                        ),
                        title: Text(item.title, style: TextStyle(fontWeight: item.isRead ? FontWeight.w600 : FontWeight.w800)),
                        subtitle: Text('${item.message}\n${DateFormat('MMM d, HH:mm').format(item.createdAt.toLocal())}', style: const TextStyle(color: AppColors.muted, height: 1.35)),
                        isThreeLine: true,
                        trailing: item.isRead ? null : const Icon(Icons.circle, color: AppColors.coral, size: 10),
                      ),
                    );
                  },
                ),
              ),
          ]),
        ),
      );
}
