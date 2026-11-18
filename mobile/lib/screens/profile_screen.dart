import 'package:material_ui/material_ui.dart';

import '../controllers/app_controller.dart';
import '../core/config/app_config.dart';
import '../core/theme/app_theme.dart';
import '../models/incident.dart';
import '../widgets/brand_mark.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key, required this.controller});
  final AppController controller;

  @override
  Widget build(BuildContext context) {
    final session = controller.session!;
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 30),
        children: [
          Text('Account', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 20),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(children: [
                const BrandMark(size: 66),
                const SizedBox(width: 16),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(session.fullName ?? session.email.split('@').first, style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 4),
                  Text(session.email, style: const TextStyle(color: AppColors.muted)),
                  const SizedBox(height: 9),
                  Container(padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5), decoration: BoxDecoration(color: AppColors.teal.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(20)), child: Text(Incident.readable(session.role).toUpperCase(), style: const TextStyle(color: AppColors.teal, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 0.8))),
                ])),
              ]),
            ),
          ),
          const SizedBox(height: 18),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(children: [
                const _Setting(icon: Icons.security_rounded, title: 'Secure session', subtitle: 'Token stored in encrypted device storage'),
                const Divider(height: 28, color: AppColors.line),
                const _Setting(icon: Icons.cloud_done_outlined, title: 'Live platform', subtitle: 'Connected to the production ReliefMesh API'),
                const Divider(height: 28, color: AppColors.line),
                _Setting(icon: Icons.link_rounded, title: 'API host', subtitle: AppConfig.normalizedBaseUrl),
              ]),
            ),
          ),
          const SizedBox(height: 18),
          OutlinedButton.icon(
            onPressed: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Sign out?'),
                  content: const Text('Your encrypted session will be removed from this device.'),
                  actions: [TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')), FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Sign out'))],
                ),
              );
              if (confirmed == true) await controller.signOut();
            },
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Sign out securely'),
            style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(52), foregroundColor: AppColors.coral, side: const BorderSide(color: AppColors.coral)),
          ),
          const SizedBox(height: 18),
          const Text('ReliefMesh Mobile 1.0.0\nBuilt for reliable field response.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.muted, fontSize: 11, height: 1.5)),
        ],
      ),
    );
  }
}

class _Setting extends StatelessWidget {
  const _Setting({required this.icon, required this.title, required this.subtitle});
  final IconData icon;
  final String title;
  final String subtitle;
  @override
  Widget build(BuildContext context) => Row(children: [
        Icon(icon, color: AppColors.teal),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(height: 3), Text(subtitle, style: const TextStyle(color: AppColors.muted, fontSize: 12))])),
      ]);
}
