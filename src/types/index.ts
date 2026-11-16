import type { Role, IncidentCategory, Severity, IncidentStatus } from "@prisma/client";

export type { Role, IncidentCategory, Severity, IncidentStatus };

export interface AuthenticatedActor {
  id: string;
  role: Role;
}
