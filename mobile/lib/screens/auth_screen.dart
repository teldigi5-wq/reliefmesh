import 'package:material_ui/material_ui.dart';

import '../controllers/app_controller.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../widgets/brand_mark.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, required this.controller});
  final AppController controller;
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _phone = TextEditingController();
  bool _register = false;
  bool _obscure = true;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _phone.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    try {
      if (_register) {
        await widget.controller.register(
          fullName: _name.text,
          email: _email.text,
          password: _password.text,
          phone: _phone.text,
        );
      } else {
        await widget.controller.signIn(_email.text, _password.text);
      }
    } on ApiException catch (error) {
      if (mounted) _message(error.message);
    } catch (_) {
      if (mounted) _message('Something went wrong. Please try again.');
    }
  }

  void _message(String value) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(value)));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Align(alignment: Alignment.centerLeft, child: BrandMark(size: 76)),
                    const SizedBox(height: 26),
                    Text(_register ? 'Join the response network.' : 'When every second matters.', style: Theme.of(context).textTheme.displaySmall),
                    const SizedBox(height: 12),
                    Text(
                      _register ? 'Create a verified citizen account connected to the live ReliefMesh platform.' : 'Secure access to incident reporting, status updates and emergency coordination.',
                      style: const TextStyle(color: AppColors.muted, fontSize: 16, height: 1.5),
                    ),
                    const SizedBox(height: 30),
                    SegmentedButton<bool>(
                      segments: const [
                        ButtonSegment(value: false, label: Text('Sign in'), icon: Icon(Icons.lock_open_rounded)),
                        ButtonSegment(value: true, label: Text('Create account'), icon: Icon(Icons.person_add_alt_1_rounded)),
                      ],
                      selected: {_register},
                      showSelectedIcon: false,
                      onSelectionChanged: (value) => setState(() => _register = value.first),
                    ),
                    const SizedBox(height: 24),
                    if (_register) ...[
                      TextFormField(
                        controller: _name,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.name],
                        decoration: const InputDecoration(labelText: 'Full name', prefixIcon: Icon(Icons.badge_outlined)),
                        validator: (value) => (value?.trim().length ?? 0) < 2 ? 'Enter your full name' : null,
                      ),
                      const SizedBox(height: 14),
                      TextFormField(
                        controller: _phone,
                        keyboardType: TextInputType.phone,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.telephoneNumber],
                        decoration: const InputDecoration(labelText: 'Phone (optional)', prefixIcon: Icon(Icons.phone_outlined)),
                      ),
                      const SizedBox(height: 14),
                    ],
                    TextFormField(
                      controller: _email,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.email],
                      autocorrect: false,
                      decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.alternate_email_rounded)),
                      validator: (value) => !(value?.contains('@') ?? false) ? 'Enter a valid email address' : null,
                    ),
                    const SizedBox(height: 14),
                    TextFormField(
                      controller: _password,
                      obscureText: _obscure,
                      autofillHints: _register ? const [AutofillHints.newPassword] : const [AutofillHints.password],
                      onFieldSubmitted: (_) => _submit(),
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.key_rounded),
                        suffixIcon: IconButton(
                          onPressed: () => setState(() => _obscure = !_obscure),
                          icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                        ),
                      ),
                      validator: (value) => _register && (value?.length ?? 0) < 8 ? 'Use at least 8 characters' : (value?.isEmpty ?? true) ? 'Enter your password' : null,
                    ),
                    const SizedBox(height: 22),
                    FilledButton.icon(
                      onPressed: widget.controller.isAuthenticating ? null : _submit,
                      icon: widget.controller.isAuthenticating
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : Icon(_register ? Icons.arrow_forward_rounded : Icons.shield_outlined),
                      label: Text(_register ? 'Create secure account' : 'Sign in securely'),
                    ),
                    const SizedBox(height: 18),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [Icon(Icons.verified_user_outlined, color: AppColors.teal, size: 17), SizedBox(width: 7), Text('Encrypted session • Live production API', style: TextStyle(color: AppColors.muted, fontSize: 12))],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
