import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Fraunces carries the page's emotional register — headlines and section
// titles that are making a human statement ("Safety for Every Life.") —
// while Inter stays the functional voice for nav, body copy, pricing and
// specs. Two clearly distinct typefaces, each doing one job.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Static string, written by us, no user input anywhere in it —
          // this is the standard "avoid a flash of the wrong theme"
          // pattern, not a place untrusted content ever flows through.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
