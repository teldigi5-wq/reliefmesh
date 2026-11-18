class Volunteer {
  const Volunteer({
    required this.id,
    required this.fullName,
    required this.email,
    required this.isAvailable,
    required this.skills,
  });

  final String id;
  final String fullName;
  final String email;
  final bool isAvailable;
  final List<String> skills;

  factory Volunteer.fromJson(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>;
    return Volunteer(
      id: json['id'] as String,
      fullName: user['fullName'] as String,
      email: user['email'] as String,
      isAvailable: json['isAvailable'] as bool,
      skills: (json['skills'] as List<dynamic>).cast<String>(),
    );
  }
}
