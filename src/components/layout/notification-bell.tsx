"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Inbox, X } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedIncidentId: string | null;
  createdAt: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error("Unable to retrieve notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      setError(null);
    } catch {
      setError("Notifications could not be refreshed. Try again.");
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 30_000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function markAllRead() {
    if (busy || unreadCount === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (!res.ok) throw new Error("Unable to mark notifications read");
      setNotifications(current => current.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setError(null);
      await load();
    } catch {
      setError("Could not mark notifications as read. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function openNotification(notification: Notification) {
    if (!notification.isRead) {
      try {
        const res = await fetch("/api/notifications/" + encodeURIComponent(notification.id) + "/read", {
          method: "POST",
        });
        if (res.ok) {
          setNotifications(current => current.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          ));
          setUnreadCount(current => Math.max(0, current - 1));
        }
      } catch {
        // Navigation to an incident remains possible even if the mark-read request fails.
      }
    }
    setOpen(false);
    if (notification.relatedIncidentId) {
      // Preserve the existing app's hard-navigation approach for incident details.
      window.location.href = "/incidents/" + encodeURIComponent(notification.relatedIncidentId);
    }
  }

  const visible = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div ref={containerRef} className="ops-notifications-anchor">
      <button
        type="button"
        onClick={() => { setOpen(value => !value); if (!open) void load(); }}
        className="ops-notifications-trigger"
        aria-label="Notifications"
        aria-expanded={open}
        aria-controls={panelId}
        title="Notifications"
      >
        <Bell size={18} aria-hidden="true" />
        <span className="ops-notifications-label">Notifications</span>
        {unreadCount > 0 && (
          <span className="ops-notification-count" aria-label={unreadCount + " unread"}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          id={panelId}
          className="ops-notifications-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <div className="ops-notification-header">
            <div className="ops-notification-heading">
              <span className="ops-notification-heading-icon"><Bell size={17} aria-hidden="true" /></span>
              <div>
                <h2 id={titleId}>Notifications</h2>
                <p>{unreadCount} unread {unreadCount === 1 ? "update" : "updates"}</p>
              </div>
            </div>
            <button
              type="button"
              className="ops-notification-close"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>

          <div className="ops-notification-toolbar">
            <div className="ops-notification-tabs" role="group" aria-label="Filter notifications">
              <button type="button" className={filter === "all" ? "is-selected" : ""}
                onClick={() => setFilter("all")} aria-pressed={filter === "all"}>
                All
              </button>
              <button type="button" className={filter === "unread" ? "is-selected" : ""}
                onClick={() => setFilter("unread")} aria-pressed={filter === "unread"}>
                Unread
              </button>
            </div>
            <button type="button" className="ops-mark-read"
              disabled={busy || unreadCount === 0}
              onClick={() => void markAllRead()}>
              <CheckCheck size={14} aria-hidden="true" /> Mark all read
            </button>
          </div>

          <div className="ops-notification-scroll" aria-label="Notification entries">
            {error && <p className="ops-notification-error" role="alert">{error}</p>}
            {visible.length === 0 ? (
              <div className="ops-notification-empty">
                <Inbox size={23} aria-hidden="true" />
                <strong>{filter === "unread" ? "You're all caught up" : "No notifications yet"}</strong>
                <span>{filter === "unread" ? "There are no unread updates." : "New updates will appear here."}</span>
              </div>
            ) : visible.map(n => (
              <button key={n.id} type="button"
                className={"ops-notification-item" + (n.isRead ? " is-read" : " is-unread")}
                onClick={() => void openNotification(n)}
              >
                <span className="ops-notification-status" aria-hidden="true" />
                <span className="ops-notification-body">
                  <strong>{n.title}</strong>
                  <span>{n.message}</span>
                  <time dateTime={n.createdAt}>{new Date(n.createdAt).toLocaleString()}</time>
                </span>
              </button>
            ))}
          </div>

          <div className="ops-notification-footer">
            <span>{notifications.length} recent updates</span>
            <Link href="/incidents" onClick={() => setOpen(false)}>
              View incidents
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
