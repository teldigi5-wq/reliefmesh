class AppConfig {
  AppConfig._();

  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://reliefmesh-theta.vercel.app',
  );

  static String get normalizedBaseUrl {
    final value = apiBaseUrl.trim();
    return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
  }
}
