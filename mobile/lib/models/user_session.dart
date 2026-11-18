class UserSession {
  const UserSession({required this.id, required this.email, required this.role, this.fullName, this.phone});
  final String id;
  final String email;
  final String role;
  final String? fullName;
  final String? phone;

  factory UserSession.fromJson(Map<String, dynamic> json) => UserSession(
        id: json['id'] as String,
        email: json['email'] as String,
        role: json['role'] as String,
        fullName: json['fullName'] as String?,
        phone: json['phone'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'role': role,
        if (fullName != null) 'fullName': fullName,
        if (phone != null) 'phone': phone,
      };
}
