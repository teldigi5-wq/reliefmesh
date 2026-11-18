class Incident {
  const Incident({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.severity,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.createdAt,
    this.address,
  });
  final String id;
  final String title;
  final String description;
  final String category;
  final String severity;
  final String status;
  final double latitude;
  final double longitude;
  final String? address;
  final DateTime createdAt;

  factory Incident.fromJson(Map<String, dynamic> json) => Incident(
        id: json['id'] as String,
        title: json['title'] as String,
        description: json['description'] as String,
        category: json['category'] as String,
        severity: json['severity'] as String,
        status: json['status'] as String,
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        address: json['address'] as String?,
        createdAt: DateTime.parse(json['createdAt'] as String),
      );

  static String readable(String value) => value
      .toLowerCase()
      .split('_')
      .map((word) => word.isEmpty ? word : '${word[0].toUpperCase()}${word.substring(1)}')
      .join(' ');
}
