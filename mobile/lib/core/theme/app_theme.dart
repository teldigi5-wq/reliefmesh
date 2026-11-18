import 'package:material_ui/material_ui.dart';

class AppColors {
  AppColors._();
  static const ink = Color(0xFF07111E);
  static const panel = Color(0xFF0D1B2A);
  static const raised = Color(0xFF13263A);
  static const coral = Color(0xFFFF5A5F);
  static const coralSoft = Color(0xFFFF8588);
  static const teal = Color(0xFF27D3C2);
  static const gold = Color(0xFFFFC857);
  static const text = Color(0xFFF3F7FA);
  static const muted = Color(0xFF91A4B7);
  static const line = Color(0xFF20364B);
}

class AppTheme {
  AppTheme._();

  static ThemeData get dark {
    final scheme = ColorScheme.fromSeed(
      seedColor: AppColors.coral,
      brightness: Brightness.dark,
      surface: AppColors.panel,
      primary: AppColors.coral,
      secondary: AppColors.teal,
      error: AppColors.coralSoft,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: AppColors.ink,
      fontFamily: 'sans-serif',
      textTheme: const TextTheme(
        displaySmall: TextStyle(fontSize: 34, height: 1.08, fontWeight: FontWeight.w800, letterSpacing: -1),
        headlineSmall: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, letterSpacing: -0.4),
        titleLarge: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
        titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        bodyLarge: TextStyle(height: 1.45),
      ),
      cardTheme: CardThemeData(
        color: AppColors.panel,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppColors.line),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.panel,
        labelStyle: const TextStyle(color: AppColors.muted),
        hintStyle: const TextStyle(color: AppColors.muted),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 17),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.line)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.line)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.teal, width: 1.5)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(54),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          textStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
        ),
      ),
      navigationBarTheme: const NavigationBarThemeData(
        backgroundColor: AppColors.panel,
        indicatorColor: Color(0x3327D3C2),
        height: 72,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.raised,
        contentTextStyle: const TextStyle(color: AppColors.text),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
