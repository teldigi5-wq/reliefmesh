import { apiRequest } from "./client";

export type IncidentCategory =
  | "FLOOD"
  | "LANDSLIDE"
  | "FIRE"
  | "MEDICAL_EMERGENCY"
  | "ROAD_ACCIDENT"
  | "MISSING_PERSON"
  | "INFRASTRUCTURE_DAMAGE"
  | "OTHER";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "REPORTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "ASSIGNED"
  | "RESPONDING"
  | "RESOLVED"
  | "CLOSED";

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: Severity;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address?: string | null;
  createdAt: string;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  category: IncidentCategory;
  severity: Severity;
  latitude: number;
  longitude: number;
  address?: string;
}

export function createIncident(input: CreateIncidentInput) {
  return apiRequest<Incident>("/api/incidents", { method: "POST", body: input });
}

export function listMyIncidents() {
  return apiRequest<Incident[]>("/api/incidents");
}

export function getIncident(id: string) {
  return apiRequest<Incident>(`/api/incidents/${id}`);
}
