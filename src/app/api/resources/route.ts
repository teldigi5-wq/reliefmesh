import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { resourceService } from "@/services/resource.service";
import { createResourceSchema } from "@/lib/validation/resource";
import { PermissionError } from "@/lib/permissions";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const resources = await resourceService.listAll();
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createResourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const resource = await resourceService.create(parsed.data, {
      id: session.userId,
      role: session.role,
    });
    return NextResponse.json(resource, { status: 201 });
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }
}
