import React, { useState, useEffect } from 'react';

interface HeroCarouselProps {
  slides: {
    title: string;
    description: string;
  }[];
  autoAdvanceInterval?: number; // in milliseconds, defaults to 5000 (5 seconds)
  onSlideChange?: (newIndex: number) => void; // Callback for parent to react to slide changes
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, autoAdvanceInterval = 5000, onSlideChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % slides.length;
        if (onSlideChange) {
          onSlideChange(nextSlide);
        }
        return nextSlide;
      });
    }, autoAdvanceInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoAdvanceInterval, onSlideChange]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  if (!slides || slides.length === 0) {
    return null; // Or render a fallback/loading state
  }

  const { title, description } = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slide content */}
      <div className="transition-opacity duration-700 ease-in-out">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-16">
          {description}
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel; 