import React from 'react';

interface NaoLogoProps {
  className?: string;
  showText?: boolean;
}

const NaoLogo: React.FC<NaoLogoProps> = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Swooshing Stripes inspired by the van image */}
        <path
          d="M10 50 Q 30 10, 90 20"
          stroke="var(--accent-orange)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ stroke: 'hsl(var(--accent-orange))' }}
        />
        <path
          d="M5 55 Q 25 15, 85 25"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ stroke: 'hsl(var(--primary))' }}
        />
      </svg>
      {showText && (
        <span className="text-slate-900 font-black tracking-tighter text-xl uppercase">
          NAO<span className="text-primary ml-1">Express</span>
        </span>
      )}
    </div>
  );
};

export default NaoLogo;
