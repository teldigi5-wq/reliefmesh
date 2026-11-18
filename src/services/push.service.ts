import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { prisma } from "@/lib/db/prisma";

function firebaseApp(): App | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  if (getApps().length > 0) return getApps()[0]!;
  try {
    return initializeApp({ credential: cert(JSON.parse(raw) as ServiceAccount) });
  } catch (error) {
    console.error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON; push delivery disabled", error);
    return null;
  }
}

export const pushService = {
  async sendToUser(userId: string, input: { title: string; message: string; incidentId?: string }) {
    const app = firebaseApp();
    if (!app) return;
    const devices = await prisma.pushToken.findMany({ where: { userId }, select: { token: true } });
    if (devices.length === 0) return;

    const tokens = devices.map((device) => device.token);
    const result = await getMessaging(app).sendEachForMulticast({
      tokens,
      notification: { title: input.title, body: input.message },
      data: { incidentId: input.incidentId ?? "" },
      android: {
        priority: "high",
        notification: { channelId: "reliefmesh_alerts", sound: "default", priority: "max" },
      },
      apns: { payload: { aps: { sound: "default", contentAvailable: true } } },
    });

    const invalid = result.responses
      .map((response, index) => ({ response, token: tokens[index]! }))
      .filter(({ response }) =>
        ["messaging/registration-token-not-registered", "messaging/invalid-registration-token"].includes(
          response.error?.code ?? ""
        )
      )
      .map(({ token }) => token);
    if (invalid.length > 0) await prisma.pushToken.deleteMany({ where: { token: { in: invalid } } });
  },
};
