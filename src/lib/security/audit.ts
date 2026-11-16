import { prisma } from "@/lib/db/prisma";

/**
 * Writes one AuditLog row. Deliberately swallows its own errors — an audit
 * log failing to write must never break the action it's recording (e.g. a
 * user should still be able to log in even if the audit insert fails for
 * some unrelated reason). Errors are logged to the server console instead.
 */
export async function auditLog(
  userId: string | null,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? undefined,
        action,
        entityType,
        entityId,
        metadata: metadata as any,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log", { action, entityType, entityId, err });
  }
}
