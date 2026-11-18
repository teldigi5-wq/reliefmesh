"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

type SiteMessage = { text: string; tone: "success" | "info" };

export function SiteFeedback() {
  const [message, setMessage] = useState<SiteMessage | null>(null);

  useEffect(() => {
    try {
      const flash = sessionStorage.getItem("reliefmesh_flash");
      if (flash) {
        sessionStorage.removeItem("reliefmesh_flash");
        setMessage({ text: flash, tone: "success" });
      }
    } catch {
      // Disabled storage should never prevent the page from loading.
    }

    const show = (event: Event) => {
      const detail = (event as CustomEvent<Partial<SiteMessage>>).detail;
      if (detail && typeof detail.text === "string" && detail.text.length <= 180) {
        setMessage({ text: detail.text, tone: detail.tone === "success" ? "success" : "info" });
      }
    };
    window.addEventListener("reliefmesh:toast", show);
    return () => window.removeEventListener("reliefmesh:toast", show);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(null), 4600);
    return () => window.clearTimeout(timeout);
  }, [message]);

  if (!message) return null;
  return (
    <div className="rm-toast" role="status" aria-live="polite">
      <span className="rm-toast-icon">
        {message.tone === "success" ? <CheckCircle2 size={20} /> : <Info size={20} />}
      </span>
      <span>{message.text}</span>
      <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss notification">
        <X size={17}/>
      </button>
    </div>
  );
}
