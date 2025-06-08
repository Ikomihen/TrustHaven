// src/ui/BackToTopButton.tsx
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react'; // Assuming lucide-react is installed

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to a certain amount
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Adjust this value as needed (e.g., 200, 400)
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 // Position: bottom-right
        bg-primary text-white // Background and text color
        p-3 rounded-full // Padding and shape
        shadow-lg // Shadow for depth
        hover:bg-primary-dark // Hover effect (adjust as per your primary-dark or a darker shade of primary)
        focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75 // Focus styles
        transition-opacity duration-300 ease-in-out transform // Smooth transition for opacity and scale
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'} // Show/hide logic
        z-[1000] // Ensure it's above other content
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default BackToTopButton;