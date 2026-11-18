import 'dart:async';

import 'package:material_ui/material_ui.dart';

import '../controllers/app_controller.dart';
import 'dashboard_screen.dart';
import 'incident_detail_screen.dart';
import 'incidents_screen.dart';
import 'notifications_screen.dart';
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
  StreamSubscription<String>? _notificationOpenSubscription;
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _notificationOpenSubscription =
        widget.controller.notificationService.incidentOpened.listen(_openIncident);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final incidentId = widget.controller.notificationService.takePendingIncidentId();
      if (incidentId != null) _openIncident(incidentId);
    });
    _refreshTimer = Timer.periodic(const Duration(seconds: 15), (_) async {
      try {
        await Future.wait([
          widget.controller.refreshIncidents(),
          widget.controller.refreshNotifications(),
        ]);
      } catch (_) {
        // Keep the last successful state visible during a temporary outage.
      }
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _notificationOpenSubscription?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _selectDestination(int value) {
    if (value == _index) return;
    setState(() => _index = value);
    _pageController.animateToPage(
      value,
      duration: const Duration(milliseconds: 420),
      curve: Curves.easeOutCubic,
    );
  }

  void _openIncidents() {
    if (!mounted) return;
    final isCitizen = widget.controller.session!.role == 'CITIZEN';
    _selectDestination(isCitizen ? 2 : 1);
  }

  Future<void> _openIncident(String incidentId) async {
    _openIncidents();
    try {
      final incident = await widget.controller.incidentService.getById(incidentId);
      if (!mounted) return;
      await Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => IncidentDetailScreen(
            incident: incident,
            controller: widget.controller,
          ),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This incident is no longer available.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isCitizen = widget.controller.session!.role == 'CITIZEN';
    final pages = isCitizen
        ? <Widget>[
            DashboardScreen(controller: widget.controller, openReport: () => _selectDestination(1)),
            ReportScreen(controller: widget.controller, onCreated: () => _selectDestination(2)),
            IncidentsScreen(controller: widget.controller),
            NotificationsScreen(controller: widget.controller),
            ProfileScreen(controller: widget.controller),
          ]
        : <Widget>[
            DashboardScreen(controller: widget.controller, openReport: () => _selectDestination(1)),
            IncidentsScreen(controller: widget.controller),
            NotificationsScreen(controller: widget.controller),
            ProfileScreen(controller: widget.controller),
          ];
    final destinations = _destinations(widget.controller.unreadNotifications, includeReport: isCitizen);
    if (_index >= pages.length) _index = 0;
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: pages,
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(12, 0, 12, 10),
        child: Container(
          decoration: BoxDecoration(
            color: (isDark ? const Color(0xFF0D211E) : Colors.white).withValues(alpha: 0.96),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.09) : const Color(0xFFDDE7E4),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.28 : 0.10),
                blurRadius: 28,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: NavigationBarTheme(
            data: NavigationBarThemeData(
              height: 72,
              elevation: 0,
              backgroundColor: Colors.transparent,
              indicatorColor: theme.colorScheme.primary.withValues(alpha: isDark ? 0.24 : 0.13),
              indicatorShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              labelTextStyle: WidgetStateProperty.resolveWith((states) {
                final selected = states.contains(WidgetState.selected);
                return theme.textTheme.labelSmall?.copyWith(
                  fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
                  color: selected
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurface.withValues(alpha: 0.58),
                );
              }),
              iconTheme: WidgetStateProperty.resolveWith((states) => IconThemeData(
                    size: states.contains(WidgetState.selected) ? 25 : 23,
                    color: states.contains(WidgetState.selected)
                        ? theme.colorScheme.primary
                        : theme.colorScheme.onSurface.withValues(alpha: 0.55),
                  )),
            ),
            child: NavigationBar(
              selectedIndex: _index,
              animationDuration: const Duration(milliseconds: 420),
              onDestinationSelected: _selectDestination,
              destinations: destinations,
            ),
          ),
        ),
      ),
    );
  }

  List<NavigationDestination> _destinations(int unread, {required bool includeReport}) => [
        const NavigationDestination(icon: Icon(Icons.grid_view_rounded), label: 'Home'),
        if (includeReport) const NavigationDestination(icon: Icon(Icons.add_location_alt_outlined), selectedIcon: Icon(Icons.add_location_alt_rounded), label: 'Report'),
        const NavigationDestination(icon: Icon(Icons.timeline_outlined), selectedIcon: Icon(Icons.timeline_rounded), label: 'Incidents'),
        NavigationDestination(
          icon: Badge(isLabelVisible: unread > 0, label: Text(unread > 99 ? '99+' : '$unread'), child: const Icon(Icons.notifications_none_rounded)),
          selectedIcon: Badge(isLabelVisible: unread > 0, label: Text(unread > 99 ? '99+' : '$unread'), child: const Icon(Icons.notifications_rounded)),
          label: 'Alerts',
        ),
        const NavigationDestination(icon: Icon(Icons.person_outline_rounded), selectedIcon: Icon(Icons.person_rounded), label: 'Account'),
      ];
}
