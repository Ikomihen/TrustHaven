import React from 'react';
// import { Home } from 'lucide-react'; // No longer needed if using custom SVG

// Import your custom logo SVG file
// The path is relative from src/components/layout/Logo.tsx to src/assets/logo.svg
import customLogo from '../../assets/logo.png'; 

const Logo: React.FC = () => {
  return (
    // You might want to adjust the div's styling (w-8 h-8 bg-primary rounded-md)
    // if your custom logo already has its own background or specific sizing needs.
    // For now, I'll keep it as is, but you can remove bg-primary or rounded-md if your logo already handles that.
    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
      {/* Use an img tag to display your SVG logo */}
      <img src={customLogo} alt="Company Logo" className="w-full h-full object-contain" />
      {/* <Home className="w-5 h-5 text-white" /> Removed */}
    </div>
  );
};

export default Logo;