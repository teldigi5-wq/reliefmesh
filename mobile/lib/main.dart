import 'package:material_ui/material_ui.dart';

import 'app.dart';
import 'controllers/app_controller.dart';
import 'core/network/api_client.dart';
import 'services/auth_service.dart';
import 'services/incident_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final api = ApiClient();
  final controller = AppController(
    authService: AuthService(api),
    incidentService: IncidentService(api),
  );
  runApp(ReliefMeshApp(controller: controller));
  await controller.bootstrap();
}
