class AppNotification {
  const AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.isRead,
    required this.createdAt,
    this.relatedIncidentId,
  });

  final String id;
  final String title;
  final String message;
  final String type;
  final bool isRead;
  final DateTime createdAt;
  final String? relatedIncidentId;

  factory AppNotification.fromJson(Map<String, dynamic> json) => AppNotification(
        id: json['id'] as String,
        title: json['title'] as String,
        message: json['message'] as String,
        type: json['type'] as String,
        isRead: json['isRead'] as bool,
        createdAt: DateTime.parse(json['createdAt'] as String),
        relatedIncidentId: json['relatedIncidentId'] as String?,
      );
}
