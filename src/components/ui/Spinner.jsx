const Spinner = ({ label = "Loading" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
    <svg className="h-8 w-8 animate-spin text-brand" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <p className="text-sm">{label}</p>
  </div>
);

export default Spinner;
