// Shared class strings for form controls, kept as plain constants (not a
// wrapper component) so every existing <label>/<input> structure — and the
// accessible names Playwright's getByLabel() relies on — stays untouched.
export const labelClass = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
