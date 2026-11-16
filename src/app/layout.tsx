import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReliefMesh — Emergency Response Coordination",
  description:
    "Connecting citizens, responders and organisations through real-time incident management and IoT-ready infrastructure.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
