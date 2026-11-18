import 'package:material_ui/material_ui.dart';

import 'controllers/app_controller.dart';
import 'core/theme/app_theme.dart';
import 'screens/auth_screen.dart';
import 'screens/home_shell.dart';
import 'widgets/brand_mark.dart';

class ReliefMeshApp extends StatelessWidget {
  const ReliefMeshApp({super.key, required this.controller});
  final AppController controller;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ReliefMesh',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      home: AnimatedBuilder(
        animation: controller,
        builder: (context, _) {
          if (controller.isBootstrapping) return const _LaunchScreen();
          if (controller.session == null) return AuthScreen(controller: controller);
          return HomeShell(controller: controller);
        },
      ),
    );
  }
}

class _LaunchScreen extends StatelessWidget {
  const _LaunchScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            BrandMark(size: 92),
            SizedBox(height: 24),
            Text('RELIEFMESH', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, letterSpacing: 3)),
            SizedBox(height: 20),
            SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2)),
          ],
        ),
      ),
    );
  }
}
