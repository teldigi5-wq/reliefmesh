/**
 * Demonstration seed data. Locations here are intentionally generic
 * placeholders — not real emergency locations — per project requirements.
 *
 * Run with: npm run prisma:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const [admin, operator, responder, citizen] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@reliefmesh.test" },
      update: {},
      create: {
        email: "admin@reliefmesh.test",
        passwordHash,
        fullName: "Ada Admin",
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "operator@reliefmesh.test" },
      update: {},
      create: {
        email: "operator@reliefmesh.test",
        passwordHash,
        fullName: "Oscar Operator",
        role: "OPERATOR",
      },
    }),
    prisma.user.upsert({
      where: { email: "responder@reliefmesh.test" },
      update: {},
      create: {
        email: "responder@reliefmesh.test",
        passwordHash,
        fullName: "Rita Responder",
        role: "RESPONDER",
      },
    }),
    prisma.user.upsert({
      where: { email: "citizen@reliefmesh.test" },
      update: {},
      create: {
        email: "citizen@reliefmesh.test",
        passwordHash,
        fullName: "Cal Citizen",
        role: "CITIZEN",
      },
    }),
  ]);

  await prisma.volunteer.upsert({
    where: { userId: responder.id },
    update: {},
    create: {
      userId: responder.id,
      skills: ["first-aid", "search-and-rescue"],
      isAvailable: true,
    },
  });

  // Demonstration incident — placeholder coordinates, not a real location.
  const incident = await prisma.incident.create({
    data: {
      title: "Demonstration: flooded access road",
      description:
        "Seed data for development only. Describes a hypothetical flooded road blocking access to a residential area.",
      category: "FLOOD",
      severity: "HIGH",
      status: "REPORTED",
      latitude: 6.9271,
      longitude: 79.8612,
      address: "Demonstration location — not a real address",
      reportedById: citizen.id,
    },
  });

  await prisma.resource.create({
    data: {
      name: "Emergency drinking water (seed data)",
      category: "FOOD_AND_WATER",
      quantityTotal: 500,
      unit: "liters",
    },
  });

  console.log("Seed complete:");
  console.log({ admin: admin.email, operator: operator.email, responder: responder.email, citizen: citizen.email });
  console.log("Demo login password for all seeded accounts: Password123!");
  console.log(`Seed incident id: ${incident.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
