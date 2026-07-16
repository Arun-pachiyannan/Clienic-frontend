const Logo = ({ className = "h-9 w-9", showWordmark = true, wordmarkClassName = "" }) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 48 48"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 24c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c-3 0-5.7-1.3-7.5-3.5"
          stroke="#2563EB"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34 24c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10c3 0 5.7-1.3 7.5-3.5"
          stroke="#14B8A6"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="20.5" y="14" width="7" height="20" rx="1.8" fill="#F8FAFC" />
        <rect x="14" y="20.5" width="20" height="7" rx="1.8" fill="#F8FAFC" />
      </svg>
      {showWordmark && (
        <span className={`font-display font-bold text-ink tracking-tight ${wordmarkClassName}`}>
          ANAN<span className="text-brand"> Clinic</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
