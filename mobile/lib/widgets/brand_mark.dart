import 'package:material_ui/material_ui.dart';
import 'package:flutter_svg/flutter_svg.dart';

class BrandMark extends StatelessWidget {
  const BrandMark({super.key, this.size = 48});
  final double size;
  @override
  Widget build(BuildContext context) => SvgPicture.asset(
        'assets/branding/reliefmesh_mark.svg',
        width: size,
        height: size,
        semanticsLabel: 'ReliefMesh',
      );
}
