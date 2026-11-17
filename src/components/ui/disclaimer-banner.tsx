/**
 * A plain-language reminder that this is a hackathon prototype, not a
 * vetted emergency service. Shown on the surfaces where someone either
 * submits a report that others may act on, or reads reports to decide
 * whether/how to respond — the two places bad information (or an outage)
 * would actually cost something.
 *
 * This is not a substitute for real terms of service or legal review —
 * just an honest, visible heads-up while there is neither.
 */
export function DisclaimerBanner() {
  return (
    <div
      role="note"
      className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <strong className="font-semibold">Prototype notice:</strong> ReliefMesh
      is a hackathon project, not an official emergency service. For a real
      emergency, always contact your local emergency number directly —
      don&apos;t rely on this app alone.
    </div>
  );
}
