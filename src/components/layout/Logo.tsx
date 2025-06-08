import React from 'react';
import { Home } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center w-8 h-8 bg-primary rounded-md ${className}`}>
      <Home className="w-5 h-5 text-white" />
    </div>
  );
};

export default Logo;