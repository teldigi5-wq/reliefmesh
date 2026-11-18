import 'dart:async';

import 'package:material_ui/material_ui.dart';

import '../controllers/app_controller.dart';
import 'dashboard_screen.dart';
import 'incidents_screen.dart';
import 'profile_screen.dart';
import 'report_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key, required this.controller});
  final AppController controller;
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _refreshTimer = Timer.periodic(const Duration(seconds: 15), (_) async {
      try {
        await widget.controller.refreshIncidents();
      } catch (_) {
        // Keep the last successful state visible during a temporary outage.
      }
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      DashboardScreen(controller: widget.controller, openReport: () => setState(() => _index = 1)),
      ReportScreen(controller: widget.controller, onCreated: () => setState(() => _index = 2)),
      IncidentsScreen(controller: widget.controller),
      ProfileScreen(controller: widget.controller),
    ];
    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.grid_view_rounded), selectedIcon: Icon(Icons.grid_view_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.add_location_alt_outlined), selectedIcon: Icon(Icons.add_location_alt_rounded), label: 'Report'),
          NavigationDestination(icon: Icon(Icons.timeline_outlined), selectedIcon: Icon(Icons.timeline_rounded), label: 'Activity'),
          NavigationDestination(icon: Icon(Icons.person_outline_rounded), selectedIcon: Icon(Icons.person_rounded), label: 'Account'),
        ],
      ),
    );
  }
}
