"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedIncidentId: string | null;
  createdAt: string;
};

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = await res.json();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }

  useEffect(() => {
    load();
    // Simple polling — fine for a small hackathon deployment. Replace with
    // websockets/SSE if this needs to scale past a handful of concurrent users.
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    load();
  }

  async function openNotification(n: Notification) {
    if (!n.isRead) {
      await fetch(`/api/notifications/${n.id}/read`, { method: "POST" });
      load();
    }
    setOpen(false);
    if (n.relatedIncidentId) {
      router.push(`/incidents/${n.relatedIncidentId}`);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        Notifications
        {unreadCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-800">
            <span className="text-sm font-medium">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-600">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className={`block w-full border-b border-slate-100 p-3 text-left text-sm last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                  n.isRead ? "opacity-60" : ""
                }`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-slate-500">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
          {notifications.some((n) => n.relatedIncidentId) && (
            <div className="border-t border-slate-200 p-2 text-center dark:border-slate-800">
              <Link href="/incidents" className="text-xs text-brand-600">
                View all incidents
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
