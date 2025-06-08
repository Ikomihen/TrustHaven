import React from 'react';
// Import your custom logo PNG file
import customLogo from '../../assets/logo/logo.png'; 

const Logo: React.FC = () => {
  return (
    // MODIFIED:
    // 1. Changed 'bg-primary' to 'bg-primary-light' for a lighter background.
    // 2. Increased size from 'w-10 h-10' to 'w-12 h-12'.
    <div className="flex items-center justify-center w-12 h-12 bg-primary-light rounded-md">
      {/* The img tag still fills its parent div */}
      <img src={customLogo} alt="Company Logo" className="w-full h-full object-contain" />
    </div>
  );
};

export default Logo;