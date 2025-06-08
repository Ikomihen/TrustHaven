import { useEffect, useState, useMemo } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import './partners-float.css';

const Hero = () => {
  // Removed unused declaration
  // const popularSearches = ['Apartments', 'Used Cars', 'Web Design', 'Restaurants', 'Plumbers'];

  // Animated counter for -30%
  const [percent, setPercent] = useState(0);
  useEffect(() => { // Changed from let to const
    const end = -80;
    const duration = 1200; // ms
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const value = Math.round((end / steps) * currentStep);
      setPercent(value);
      if (currentStep >= steps) {
        setPercent(end);
        clearInterval(interval);
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, []);

  // Typewriter animation for headline
  const words = useMemo(() => ['Listings', 'Businesses', 'Services'], []); // Wrapped in useMemo
  const [typeIdx, setTypeIdx] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0); // Start from 0 to type first word

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;
    const currentWord = words[typeIdx];

    // Typing speed (faster when typing, slower when deleting)
    const typingSpeed = isDeleting ? 50 : 150;
    // Pause at the end of typing
    const pauseTime = 2000;

    if (!isDeleting && charIdx < currentWord.length) {
      // Typing
      typingTimeout = setTimeout(() => {
        setCharIdx(prev => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIdx === currentWord.length) {
      // Pause at the end of typing
      typingTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && charIdx > 0) {
      // Deleting
      typingTimeout = setTimeout(() => {
        setCharIdx(prev => prev - 1);
      }, typingSpeed);
    } else {
      // Move to next word
      setIsDeleting(false);
      setTypeIdx(prev => (prev + 1) % words.length);
      setCharIdx(0);
    }

    setDisplayText(currentWord.slice(0, charIdx));
    return () => clearTimeout(typingTimeout);
  }, [charIdx, isDeleting, typeIdx, words]);

  return (
    // ADDED pt-20 HERE to push content down
    <div className="relative min-h-[600px] flex flex-col pt-20">
      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 md:px-8 max-w-screen-lg mx-auto w-full">
        {/* Announcement Banner */}
        <div className="mb-6">
          <span className="inline-block bg-yellow-100 text-yellow-900 px-4 py-2 rounded-full font-medium text-sm shadow">
            Check out our latest blog content
            <span className="ml-2">→</span>
          </span>
        </div>
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Find Trusted <br className="block md:hidden" />
          <span className="text-primary transition-colors duration-300">{displayText}</span><br />
          In Cameroon
        </h1>
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Discover verified homes, cars, services and businesses in Buea and beyond. Search, connect, and transact with confidence.
        </p>
        {/* Call-to-action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <Link to="/register" className="flex-1">
            <Button className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-gray-800 w-full">
              Get started
            </Button>
          </Link>
          <div className="flex-1">
            <Button className="bg-white border border-gray-300 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-gray-100 w-full whitespace-nowrap min-w-[150px]">
              Request demo
            </Button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-3 max-w-3xl w-full mx-auto">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Location Selector */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 md:w-1/4">
              <MapPin className="text-primary w-5 h-5 mr-2" />
              <select className="bg-transparent text-gray-800 w-full focus:outline-none appearance-none">
                <option>Buea</option>
                <option>Douala</option>
                <option>Yaoundé</option>
                <option>Bamenda</option>
                <option>Limbe</option>
              </select>
              <ChevronDown className="text-gray-500 w-4 h-4" />
            </div>
            {/* Category Selector */}
            <div className="bg-gray-100 rounded-md px-3 py-2 md:w-1/4">
              <select className="bg-transparent text-gray-800 w-full focus:outline-none appearance-none">
                <option value="">All Categories</option>
                <option>Homes</option>
                <option>Cars</option>
                <option>Services</option>
                <option>Businesses</option>
                <option>Jobs</option>
                <option>Electronics</option>
              </select>
            </div>
            {/* Search Input */}
            <div className="flex-1 flex items-center bg-gray-100 rounded-md px-3 py-2">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-transparent text-gray-800 w-full focus:outline-none"
              />
            </div>
            {/* Search Button */}
            <Button className="w-full md:w-auto flex-1">
              Search
            </Button>
          </div>
        </div>
        {/* Popular Searches (optional, can be removed for minimal look) */}
        {/* <div className="mt-6 flex flex-wrap items-center text-sm justify-center">
          <span className="mr-2 text-gray-400">Popular:</span>
          {popularSearches.map((term, index) => (
            <a
              key={index}
              href={`/listings?q=${term.toLowerCase()}`}
              className="mr-2 mb-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-gray-700 transition-colors"
            >
              {term}
            </a>
          ))}
        </div> */}
      </div>

      {/* Showcase/Mockup Section */}
      <div className="flex justify-center mt-16 px-4 md:px-8 w-full">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
          alt="Platform Mockup"
          className="rounded-2xl shadow-xl border border-gray-100 bg-white w-full max-w-3xl object-cover"
          style={{ height: 'auto' }}
        />
      </div>

      {/* Trusted By/Partners Section */}
      <div className="flex flex-wrap justify-center items-center gap-8 mt-12 mb-8 px-4 md:px-8 w-full">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8 grayscale opacity-70 float-partner animate-float delay-0" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-8 grayscale opacity-70 float-partner animate-float delay-1" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-8 grayscale opacity-70 float-partner animate-float delay-2" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-8 grayscale opacity-70 float-partner animate-float delay-3" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-8 grayscale opacity-70 float-partner animate-float delay-4" />
      </div>

      {/* Feature Highlight Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white/80 rounded-2xl shadow p-6 md:p-8 max-w-5xl mx-auto mb-16 w-full">
        {/* Left: Text and Features */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-primary font-semibold text-sm mb-2 block">Optimize</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">Introducing TrustHaven OP</h2>
          <p className="text-gray-700 mb-6 max-w-md">TrustHaven OP is designed to help solve the most common problems that people face when it comes to finding trusted listings and services in Cameroon.</p>
          <ul className="space-y-3 text-left">
            <li className="flex items-center gap-2 text-gray-800"><span className="inline-block w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">✓</span> Reduce scam and fake listings</li>
            <li className="flex items-center gap-2 text-gray-800"><span className="inline-block w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">✓</span> Connect with verified businesses</li>
            <li className="flex items-center gap-2 text-gray-800"><span className="inline-block w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">✓</span> Search, filter, and transact easily</li>
          </ul>
        </div>
        {/* Right: Circular Stat */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#f3f4f6" />
              <circle cx="100" cy="100" r="80" fill="#fff" />
            </svg>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-primary">{percent}%</span>
              <span className="text-gray-700 mt-2 text-lg">Less stress & risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;