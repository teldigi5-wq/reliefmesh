# Database

PostgreSQL via Prisma. Full schema: `prisma/schema.prisma`.

## Entities

| Model | Purpose |
|---|---|
| `User` | Account + role (`ADMIN`, `OPERATOR`, `RESPONDER`, `CITIZEN`, `ORGANISATION`) |
| `Organisation` | NGOs / local authorities a user can belong to |
| `Incident` | A reported emergency: category, severity, status, location |
| `IncidentUpdate` | Audit row for every status transition on an incident |
| `Volunteer` | Responder-specific profile (skills, availability) linked to a `User` |
| `ResponderAssignment` | A volunteer assigned to an incident, with its own status |
| `Resource` | Medical supplies, food/water, vehicles, rescue equipment, shelters-as-resource |
| `ResourceAllocation` | A resource committed to a specific incident, with history |
| `Shelter` | Temporary shelter locations and capacity |
| `GuardianDevice` | A (simulated, for now) SOS device registration |
| `SOSEvent` | An SOS trigger from a device — always `isSimulated: true` today |
| `LocationUpdate` | Append-only location history for a device (never overwritten) |
| `Notification` | In-app notification for a user |
| `AuditLog` | Generic action log (who did what, to what, when) |

## Why these choices

- **Enums** (`Role`, `IncidentCategory`, `Severity`, `IncidentStatus`, etc.)
  instead of free-text strings — the database itself rejects invalid values.
- **`IncidentUpdate` as its own table**, not just an `updatedAt` timestamp —
  the spec requires every important change to be recorded, not just the
  latest state.
- **`LocationUpdate` is append-only** — deliberately not a single
  `lastLat/lastLng` field on the device, so location history survives.
- **Foreign keys everywhere a relation exists**, with `onDelete: Cascade`
  only where losing the child rows alongside the parent is actually correct
  (e.g. deleting an incident should delete its updates; deleting a user
  should not silently delete incidents they reported).
- **Indexes** on columns used for filtering/sorting in the dashboard and
  lists (`status`, `severity`, `category`, `createdAt`, foreign keys used in
  `WHERE` clauses).

## Making schema changes

1. Edit `prisma/schema.prisma`.
2. `npm run prisma:migrate` — this creates a new migration file under
   `prisma/migrations/` and applies it to your local database. Commit the
   generated migration folder to git (it's not in `.gitignore`).
3. Update `prisma/seed.ts` if the change affects seed data.
4. Update any repository/service code that touches the changed model.

For production deployment, use `npm run prisma:deploy`
(`prisma migrate deploy`) instead of `prisma:migrate` — it applies existing
migrations without trying to generate new ones interactively.
