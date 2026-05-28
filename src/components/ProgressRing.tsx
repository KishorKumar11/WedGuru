export default function ProgressRing({ value }: { value: number }) {
  const normalized = Math.min(100, Math.max(0, value));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalized / 100) * circumference;

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" role="img" aria-label={`Progress ${normalized}%`}>
      <circle cx="55" cy="55" r={radius} stroke="#eadfd3" strokeWidth="9" fill="none" />
      <circle
        cx="55"
        cy="55"
        r={radius}
        stroke="#c8956e"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="60" textAnchor="middle" fontSize="18" fill="#2d1b33" fontWeight={700}>
        {Math.round(normalized)}%
      </text>
    </svg>
  );
}
