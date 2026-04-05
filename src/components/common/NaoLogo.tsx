import React from 'react';
import logo from '../../assets/logo.png';

interface NaoLogoProps {
  className?: string;
  showText?: boolean; // This is now handled by the image containing the text
}

const NaoLogo: React.FC<NaoLogoProps> = ({ className = "h-16", showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logo}
        alt="NAO Express"
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

export default NaoLogo;

