import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./operations.css";
import "@/components/privacy/privacy-ui.css";
import { CookiePreferences } from "@/components/privacy/cookie-preferences";
import { SiteFeedback } from "@/components/feedback/site-feedback";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReliefMesh — Emergency Response Coordination",
  description:
    "Connecting citizens, responders and organisations through real-time incident management and IoT-ready infrastructure.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#007330",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline script below sets the `dark`
    // class before React hydrates (reading a value only the browser has —
    // localStorage / prefers-color-scheme), so server and first-client
    // render intentionally differ on this one attribute.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          // Static string, written by us, no user input anywhere in it —
          // this is the standard "avoid a flash of the wrong theme"
          // pattern, not a place untrusted content ever flows through.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=document.cookie.split('; ').includes('reliefmesh_cookie_choice=preferences');var t=saved?localStorage.getItem('theme'):null;var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}<CookiePreferences /><SiteFeedback /></body>
    </html>
  );
}
