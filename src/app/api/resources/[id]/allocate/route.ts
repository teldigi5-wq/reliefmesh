import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { resourceService } from "@/services/resource.service";
import { allocateResourceSchema } from "@/lib/validation/resource";
import { PermissionError } from "@/lib/permissions";
import { InsufficientQuantityError } from "@/repositories/resource.repository";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = allocateResourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const allocation = await resourceService.allocate(params.id, parsed.data, {
      id: session.userId,
      role: session.role,
    });
    return NextResponse.json(allocation, { status: 201 });
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof InsufficientQuantityError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
