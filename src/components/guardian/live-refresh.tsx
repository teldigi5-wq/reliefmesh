"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function GuardianLiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 5_000);
    return () => window.clearInterval(timer);
  }, [router]);

  return (
    <p className="sr-only" aria-live="polite">
      Guardian monitoring refreshes live location data every five seconds.
    </p>
  );
}
