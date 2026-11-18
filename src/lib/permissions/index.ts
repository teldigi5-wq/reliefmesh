import type { Role } from "@prisma/client";

/**
 * Centralised role-based permission checks.
 * Every API route and server action should go through here rather than
 * re-implementing role checks inline.
 */

export type Permission =
  | "incident:report"
  | "incident:view_own"
  | "incident:view_all"
  | "incident:verify"
  | "incident:assign"
  | "incident:update_status"
  | "volunteer:register"
  | "volunteer:manage"
  | "resource:manage"
  | "resource:allocate"
  | "guardian:trigger_sos"
  | "guardian:manage_devices"
  | "guardian:view_locations"
  | "user:manage_roles";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    "incident:report",
    "incident:view_own",
    "incident:view_all",
    "incident:verify",
    "incident:assign",
    "incident:update_status",
    "volunteer:register",
    "volunteer:manage",
    "resource:manage",
    "resource:allocate",
    "guardian:trigger_sos",
    "guardian:manage_devices",
    "guardian:view_locations",
    "user:manage_roles",
  ],
  OPERATOR: [
    "incident:view_all",
    "incident:verify",
    "incident:assign",
    "incident:update_status",
    "volunteer:manage",
    "resource:manage",
    "resource:allocate",
    "guardian:trigger_sos",
    "guardian:manage_devices",
    "guardian:view_locations",
  ],
  RESPONDER: [
    "incident:view_own",
    "incident:update_status",
    "guardian:trigger_sos",
    "guardian:view_locations",
    "volunteer:register",
  ],
  CITIZEN: [
    "incident:report",
    "incident:view_own",
    "guardian:trigger_sos",
    "volunteer:register",
  ],
  ORGANISATION: [
    "incident:view_all",
    "resource:manage",
    "resource:allocate",
    "guardian:trigger_sos",
    "volunteer:register",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new PermissionError(
      `Role ${role} lacks required permission: ${permission}`
    );
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}
