"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, SlidersHorizontal, X } from "lucide-react";

const CONSENT_COOKIE = "reliefmesh_cookie_choice";
type Choice = "necessary" | "preferences";

function readChoice(): Choice | null {
  const raw = document.cookie.split("; ").find(part => part.startsWith(CONSENT_COOKIE + "="));
  const value = raw?.split("=")[1];
  return value === "necessary" || value === "preferences" ? value : null;
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => {
      window.dispatchEvent(new Event("reliefmesh:cookie-settings"));
    }}>Cookie settings</button>
  );
}

/**
 * Stores a first-party consent choice only. Never adds analytics/advertising
 * trackers: none are configured in ReliefMesh. The auth session cookie remains
 * essential and is set only by the server-side auth flow.
 */
export function CookiePreferences() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);

  useEffect(() => {
    const existing = readChoice();
    setChoice(existing);
    setOpen(existing === null);
    setReady(true);
    const show = () => { setSettings(true); setOpen(true); };
    window.addEventListener("reliefmesh:cookie-settings", show);
    return () => window.removeEventListener("reliefmesh:cookie-settings", show);
  }, []);

  function save(next: Choice) {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    // 180 days; SameSite=Lax; no personal information in the cookie value.
    document.cookie = CONSENT_COOKIE + "=" + next +
      "; Path=/; Max-Age=15552000; SameSite=Lax" + secure;
    try {
      if (next === "necessary") {
        // Disabling optional preferences also clears the saved theme choice.
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme",
          document.documentElement.classList.contains("dark") ? "dark" : "light");
      }
    } catch {
      // Storage may be disabled; consent to necessary cookies still works.
    }
    setChoice(next);
    setOpen(false);
    setSettings(false);
    window.dispatchEvent(new CustomEvent("reliefmesh:toast", {
      detail: { text: "Cookie preferences saved.", tone: "success" },
    }));
  }

  if (!ready || !open) return null;

  return (
    <aside className="rm-cookie-banner" aria-label="Cookie settings">
      <div className="rm-cookie-top">
        <span className="rm-cookie-symbol"><Cookie size={19} aria-hidden="true" /></span>
        <div>
          <h2>Privacy, your choice.</h2>
          <p>Essential cookies keep accounts secure. Optional preferences remember your theme.</p>
        </div>
        {choice !== null && (
          <button type="button" className="rm-cookie-close"
            onClick={() => setOpen(false)} aria-label="Close cookie settings"><X size={18}/></button>
        )}
      </div>
      {settings && (
        <div className="rm-cookie-details">
          <div><ShieldCheck size={16} aria-hidden="true" /><strong>Essential</strong><span>Always active</span></div>
          <p>Secure login session and your saved cookie choice. No advertising cookies are installed by this site.</p>
          <div><SlidersHorizontal size={16} aria-hidden="true" /><strong>Preferences</strong><span>Optional</span></div>
          <p>If permitted, the site remembers your light/dark theme using local storage.</p>
        </div>
      )}
      <div className="rm-cookie-actions">
        <button type="button" className="rm-cookie-necessary"
          onClick={() => save("necessary")}>Necessary only</button>
        <button type="button" className="rm-cookie-accept"
          onClick={() => save("preferences")}>Allow preferences</button>
      </div>
      <div className="rm-cookie-footer">
        <button type="button" onClick={() => setSettings(v => !v)}>
          {settings ? "Hide details" : "View details"}
        </button>
        <Link href="/privacy" onClick={() => setOpen(false)}>Privacy & cookies</Link>
      </div>
    </aside>
  );
}
