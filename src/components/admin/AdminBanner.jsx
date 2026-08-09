import clsx from "clsx";

// Inline feedback above an admin form/list. One component for both tones so
// success and error notices stay visually consistent across every admin page.
const TONES = {
  error: "border-red-500/40 bg-red-500/10 text-red-200",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
};

export default function AdminBanner({ message, tone = "error" }) {
  if (!message) return null;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "mb-4 rounded-xl border px-4 py-3 text-sm",
        TONES[tone] || TONES.error,
      )}
    >
      {message}
    </div>
  );
}
