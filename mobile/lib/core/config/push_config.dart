import 'package:firebase_core/firebase_core.dart';

class PushConfig {
  PushConfig._();

  static const apiKey = String.fromEnvironment('FIREBASE_API_KEY');
  static const appId = String.fromEnvironment('FIREBASE_APP_ID');
  static const messagingSenderId = String.fromEnvironment('FIREBASE_MESSAGING_SENDER_ID');
  static const projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
  static const iosBundleId = String.fromEnvironment('FIREBASE_IOS_BUNDLE_ID', defaultValue: 'com.reliefmesh.reliefmesh');

  static bool get isConfigured => apiKey.isNotEmpty && appId.isNotEmpty && messagingSenderId.isNotEmpty && projectId.isNotEmpty;

  static FirebaseOptions get options => FirebaseOptions(
        apiKey: apiKey,
        appId: appId,
        messagingSenderId: messagingSenderId,
        projectId: projectId,
        iosBundleId: iosBundleId,
      );
}
