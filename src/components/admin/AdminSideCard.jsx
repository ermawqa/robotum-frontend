// src/components/admin/AdminSideCard.jsx
// Sticky editor panel that sits beside an admin list.
export default function AdminSideCard({ title, description, children }) {
  return (
    <div className="card-surface p-5 sm:p-6 xl:sticky xl:top-6">
      {(title || description) && (
        <div className="mb-4 pb-4 border-b border-white/10 space-y-1">
          {title && (
            <h2 className="text-sm font-semibold text-white">{title}</h2>
          )}
          {description && (
            <p className="text-xs text-white/60 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
