const baseFieldClasses =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand transition-colors";

export const Field = ({ label, error, required, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export const Input = ({ error, className = "", ...props }) => (
  <input
    className={`${baseFieldClasses} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
    {...props}
  />
);

export const Textarea = ({ error, className = "", ...props }) => (
  <textarea
    className={`${baseFieldClasses} resize-none ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
    {...props}
  />
);

export const Select = ({ error, className = "", children, ...props }) => (
  <select
    className={`${baseFieldClasses} ${error ? "border-red-400" : ""} ${className}`}
    {...props}
  >
    {children}
  </select>
);
