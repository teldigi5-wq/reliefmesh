import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:material_ui/material_ui.dart';

import 'app.dart';
import 'controllers/app_controller.dart';
import 'core/config/push_config.dart';
import 'core/network/api_client.dart';
import 'services/auth_service.dart';
import 'services/app_notification_service.dart';
import 'services/incident_service.dart';
import 'services/push_notification_manager.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (PushConfig.isConfigured) {
    await Firebase.initializeApp(options: PushConfig.options);
    FirebaseMessaging.onBackgroundMessage(reliefMeshBackgroundMessageHandler);
  }
  final api = ApiClient();
  final controller = AppController(
    authService: AuthService(api),
    incidentService: IncidentService(api),
    notificationService: AppNotificationService(api),
  );
  runApp(ReliefMeshApp(controller: controller));
  await controller.bootstrap();
}
