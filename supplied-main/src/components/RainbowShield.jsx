import React from 'react';

const RainbowShield = ({ size = 32, className = '' }) => {
  const gid = React.useMemo(() => `rainbow-${Math.random().toString(36).slice(2,9)}`, []);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5f6d" />
          <stop offset="20%" stopColor="#ffc371" />
          <stop offset="40%" stopColor="#ffd166" />
          <stop offset="60%" stopColor="#38b6ff" />
          <stop offset="80%" stopColor="#7c4dff" />
          <stop offset="100%" stopColor="#ff66c4" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l-7 3v5c0 5.523 3.582 10.74 7 12 3.418-1.26 7-6.477 7-12V5l-7-3z"
        fill={`url(#${gid})`}
      />
    </svg>
  );
};

export default RainbowShield;
