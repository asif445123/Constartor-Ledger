export function DeleteIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 115" fill="none">
      <g transform="translate(0,20)"> {/* move up 10 units */}
        <rect x="10" y="30" width="60" height="70" rx="6" fill="#ef4444"/>
        <rect x="4" y="18" width="72" height="14" rx="4" fill="#dc2626"/>
        <rect x="28" y="4" width="24" height="14" rx="3" fill="#dc2626"/>
        <rect x="24" y="42" width="8" height="46" rx="3" fill="#fecaca"/>
        <rect x="38" y="42" width="8" height="46" rx="3" fill="#fecaca"/>
        <rect x="52" y="42" width="8" height="46" rx="3" fill="#fecaca"/>
      </g>
    </svg>
  );
}