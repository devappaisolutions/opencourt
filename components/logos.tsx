import React from 'react';

// Logo Option 1: Minimalist Basketball with Court Lines
export function Logo1({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle */}
      <circle cx="50" cy="50" r="48" fill="#D9623B" />
      {/* Vertical line */}
      <line x1="50" y1="2" x2="50" y2="98" stroke="#1F1D1D" strokeWidth="3" />
      {/* Horizontal line */}
      <line x1="2" y1="50" x2="98" y2="50" stroke="#1F1D1D" strokeWidth="3" />
      {/* Curved lines */}
      <path
        d="M 50 2 Q 75 50 50 98"
        stroke="#1F1D1D"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 50 2 Q 25 50 50 98"
        stroke="#1F1D1D"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

// Logo Option 2: Basketball Hoop/Net
export function Logo2({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Backboard */}
      <rect x="20" y="15" width="60" height="6" fill="#D9623B" rx="2" />
      {/* Hoop */}
      <ellipse cx="50" cy="35" rx="22" ry="6" stroke="#D9623B" strokeWidth="4" fill="none" />
      {/* Net lines */}
      <path d="M 30 35 L 35 60" stroke="#D9623B" strokeWidth="2" opacity="0.7" />
      <path d="M 40 35 L 42 60" stroke="#D9623B" strokeWidth="2" opacity="0.7" />
      <path d="M 50 35 L 50 60" stroke="#D9623B" strokeWidth="2" opacity="0.7" />
      <path d="M 60 35 L 58 60" stroke="#D9623B" strokeWidth="2" opacity="0.7" />
      <path d="M 70 35 L 65 60" stroke="#D9623B" strokeWidth="2" opacity="0.7" />
      {/* Bottom net curve */}
      <path d="M 35 60 Q 50 70 65 60" stroke="#D9623B" strokeWidth="2" fill="none" opacity="0.7" />
    </svg>
  );
}

// Logo Option 3: "OC" Monogram
export function Logo3({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#D9623B" />
      {/* O */}
      <circle cx="35" cy="50" r="18" stroke="#1F1D1D" strokeWidth="6" fill="none" />
      {/* C */}
      <path
        d="M 83 32 A 18 18 0 0 0 83 68"
        stroke="#1F1D1D"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Logo Option 4: Court Layout (Top View)
export function Logo4({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rectangle */}
      <rect x="15" y="10" width="70" height="80" stroke="#D9623B" strokeWidth="4" fill="none" rx="4" />
      {/* Center circle */}
      <circle cx="50" cy="50" r="12" stroke="#D9623B" strokeWidth="3" fill="none" />
      {/* Center line */}
      <line x1="15" y1="50" x2="85" y2="50" stroke="#D9623B" strokeWidth="3" />
      {/* Three-point arcs */}
      <path d="M 15 25 Q 35 25 35 50 Q 35 75 15 75" stroke="#D9623B" strokeWidth="3" fill="none" />
      <path d="M 85 25 Q 65 25 65 50 Q 65 75 85 75" stroke="#D9623B" strokeWidth="3" fill="none" />
    </svg>
  );
}

// Logo Option 5: Geometric Basketball
export function Logo5({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon background */}
      <path
        d="M 50 5 L 85 27.5 L 85 72.5 L 50 95 L 15 72.5 L 15 27.5 Z"
        fill="#D9623B"
      />
      {/* Inner lines creating basketball pattern */}
      <line x1="50" y1="5" x2="50" y2="95" stroke="#1F1D1D" strokeWidth="3" />
      <line x1="15" y1="27.5" x2="85" y2="72.5" stroke="#1F1D1D" strokeWidth="3" />
      <line x1="85" y1="27.5" x2="15" y2="72.5" stroke="#1F1D1D" strokeWidth="3" />
    </svg>
  );
}

// Logo Option 6: Abstract Ball in Motion
export function Logo6({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main circle */}
      <circle cx="50" cy="50" r="45" fill="#D9623B" />
      {/* Motion arc 1 */}
      <path
        d="M 10 50 Q 30 20 60 30"
        stroke="#1F1D1D"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Motion arc 2 */}
      <path
        d="M 5 60 Q 25 35 50 40"
        stroke="#1F1D1D"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Central design */}
      <circle cx="50" cy="50" r="20" stroke="#1F1D1D" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="8" fill="#1F1D1D" />
    </svg>
  );
}

// Logo Option 7: Stylized "O" with Ball
export function Logo7({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" stroke="#D9623B" strokeWidth="10" fill="none" />
      {/* Basketball seams inside */}
      <path
        d="M 50 10 Q 70 30 70 50 Q 70 70 50 90"
        stroke="#D9623B"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 50 10 Q 30 30 30 50 Q 30 70 50 90"
        stroke="#D9623B"
        strokeWidth="3"
        fill="none"
      />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#D9623B" strokeWidth="3" />
    </svg>
  );
}

// Logo Option 8: Court Key/Paint Area
export function Logo8({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(90 50 50)">
        {/* The "key" area */}
        <rect x="30" y="15" width="40" height="50" fill="#D9623B" rx="2" />
        {/* Free throw circle */}
        <circle cx="50" cy="40" r="15" fill="#1F1D1D" />
        <circle cx="50" cy="40" r="10" fill="#D9623B" />
        {/* Hoop */}
        <rect x="45" y="75" width="10" height="4" fill="#D9623B" rx="1" />
        <circle cx="50" cy="82" r="8" stroke="#D9623B" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

// Logo Option 9: Minimalist Swoosh Ball
export function Logo9({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle */}
      <circle cx="55" cy="45" r="40" fill="#D9623B" />
      {/* Swoosh */}
      <path
        d="M 10 80 Q 40 60 70 65 Q 90 68 95 75"
        stroke="#1F1D1D"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Logo Option 10: Square Court with Ball
export function Logo10({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded square */}
      <rect x="10" y="10" width="80" height="80" fill="#D9623B" rx="16" />
      {/* Court lines */}
      <line x1="50" y1="10" x2="50" y2="90" stroke="#1F1D1D" strokeWidth="2.5" opacity="0.5" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#1F1D1D" strokeWidth="2.5" opacity="0.5" />
      {/* Center ball */}
      <circle cx="50" cy="50" r="15" stroke="#1F1D1D" strokeWidth="2.5" fill="none" />
      <path d="M 50 35 Q 60 50 50 65" stroke="#1F1D1D" strokeWidth="2.5" fill="none" />
      <path d="M 50 35 Q 40 50 50 65" stroke="#1F1D1D" strokeWidth="2.5" fill="none" />
    </svg>
  );
}
