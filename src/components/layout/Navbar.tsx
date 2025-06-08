import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, // This icon will represent the "Hot Dog" menu
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  MessageSquare,
  BarChart,
  CreditCard,
  DollarSign,
  Building,
  List, // New: for Categories
  Grid, // New: for Listings
} from 'lucide-react'; // Import necessary icons

import { Button } from '../ui/Button';
import Logo from './Logo'; // Reverting to use the Logo component

// Define a type for dropdown links, now including icon and description
interface DropdownLink {
  name: string;
  path: string;
  icon?: React.ElementType; // Icon component from lucide-react
  description?: string;
}

// Reusable SimpleDropdown component (Desktop)
const SimpleDropdown = ({ links }: { links: DropdownLink[] }) => (
  <div
    className="absolute left-0 mt-4 w-[30rem] bg-white rounded-xl shadow-lg py-4 z-50
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               transition-all duration-300 ease-out transform origin-top scale-y-0 translate-y-2 group-hover:scale-y-100 group-hover:translate-y-0
               border border-gray-100"
  >
    {links.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className="flex items-start px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group
                   hover:translate-x-2 hover:shadow-sm transform hover:scale-[1.01]"
      >
        {link.icon && (
          <link.icon className="w-7 h-7 mr-4 mt-0.5 text-gray-600 group-hover:text-primary transition-colors duration-200 flex-shrink-0" />
        )}
        <div>
          <span className="block text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
            {link.name}
          </span>
          {link.description && (
            <span className="block text-base text-gray-500 mt-1 leading-normal group-hover:text-gray-600">
              {link.description}
            </span>
          )}
        </div>
      </Link>
    ))}
  </div>
);

// --- Navbar Component ---

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null); // State for mobile dropdowns
  const location = useLocation();

  useEffect(() => {
    // Close menu and any open mobile dropdown when route changes
    setIsMenuOpen(false);
    setOpenMobileDropdown(null);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenMobileDropdown(null); // Close any open mobile dropdown when main menu is toggled
  };

  const handleMobileDropdownToggle = (path: string) => {
    setOpenMobileDropdown(prevPath => (prevPath === path ? null : path));
  };

  const navLinks = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' }, // Changed /About to /about for consistency
    {
      name: 'Browse', // New "Browse" dropdown
      path: '/browse', // Main path for the Browse section
      dropdownLinks: [
        // Categories and Listings
        { name: 'Categories', path: '/browse/categories', icon: List, description: 'Explore items by category.' },
        { name: 'All Listings', path: '/browse/listings', icon: Grid, description: 'View all available listings.' },
        // Previous "Features" items now under "Browse"
        { name: 'Dashboard Analytics', path: '/features/dashboard', icon: LayoutDashboard, description: 'Gain powerful insights with intuitive dashboards.' },
        { name: 'User Management', path: '/features/users', icon: User, description: 'Efficiently manage user roles and permissions.' },
        { name: 'Real-time Chat', path: '/features/chat', icon: MessageSquare, description: 'Communicate instantly with your team or customers.' },
        { name: 'Advanced Reporting', path: '/features/reports', icon: BarChart, description: 'Generate detailed reports for informed decisions.' },
      ],
    },
    // Testimonials removed based on previous context, adding it back if needed
    // { name: 'Testimonials', path: '/testimonials' },
    {
      name: 'Pricing',
      path: '/pricing',
      dropdownLinks: [
        { name: 'Standard Plans', path: '/pricing/standard', icon: CreditCard, description: 'Flexible plans to fit your individual or small team needs.' },
        { name: 'Pro Subscriptions', path: '/pricing/pro', icon: DollarSign, description: 'Unlock advanced features for growing businesses.' },
        { name: 'Custom Enterprise', path: '/pricing/enterprise', icon: Building, description: 'Tailored solutions and dedicated support for large organizations.' },
      ],
    },
    { name: 'Contact', path: '/contact' }, // Changed /Contact to /contact for consistency
  ];

  return (
    <header className="fixed top-0 w-full z-50 pt-0 px-4">
      <div
        className="container mx-auto px-6 py-4 bg-white rounded-2xl shadow-lg
                   flex items-center justify-between max-w-7xl"
      >
        {/* Logo component */}
        <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
          <Logo /> {/* Using the Logo component here */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.dropdownLinks ? (
                <div
                  className={`flex items-center text-gray-800 hover:text-gray-950 text-base font-semibold transition-colors duration-200 cursor-pointer`}
                  aria-haspopup="true"
                >
                  {link.name}
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </div>
              ) : (
                <Link
                  to={link.path}
                  className={`text-gray-800 hover:text-gray-950 text-base font-semibold transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              )}
              {link.dropdownLinks && <SimpleDropdown links={link.dropdownLinks} />}
            </div>
          ))}
        </nav>

        {/* Auth Button (Start for free) */}
        <div className="hidden md:flex items-center">
          <Link to="/start-for-free">
            <Button
              variant="default"
              className="bg-primary hover:bg-primary-dark text-white font-bold
                         py-3 px-8 rounded-full text-base tracking-wide
                         transition-colors duration-200"
            >
              Start for free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-800 transition-transform duration-300 active:scale-95"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
          ) : (
            // Using the Lucide Menu icon, which looks like the "Hot Dog" icon
            <Menu className="w-6 h-6 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className={`md:hidden fixed inset-0 bg-white z-40 p-4 pt-12 shadow-lg overflow-y-auto
                     transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <React.Fragment key={link.path}>
                {link.dropdownLinks ? (
                  <button
                    type="button"
                    onClick={() => handleMobileDropdownToggle(link.path)}
                    className="block w-full text-left px-4 py-3 rounded-md text-gray-800 hover:bg-gray-100 font-medium flex items-center justify-between"
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === link.path ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-md text-gray-800 hover:bg-gray-100 font-medium"
                  >
                    {link.name}
                  </Link>
                )}

                {link.dropdownLinks && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                               ${openMobileDropdown === link.path ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="pl-6 pt-2 pb-2 bg-gray-50 rounded-lg border border-gray-100">
                      <ul className="space-y-1">
                        {link.dropdownLinks.map((subLink) => (
                          <li key={subLink.path}>
                            <Link
                              to={subLink.path}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-start text-gray-700 hover:text-primary hover:bg-primary/5 p-2 rounded-md text-sm transition-colors duration-200"
                            >
                              {subLink.icon && (
                                <subLink.icon className="w-4 h-4 mr-2 mt-0.5 text-gray-500 group-hover:text-primary flex-shrink-0" />
                              )}
                              <div>
                                <span className="block font-medium text-gray-800 group-hover:text-primary">{subLink.name}</span>
                                {subLink.description && (
                                  <span className="block text-xs text-gray-500 leading-tight group-hover:text-gray-600">
                                    {subLink.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/start-for-free"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center px-4 py-3 bg-primary text-white rounded-full font-bold
                         transition-colors duration-200 hover:bg-primary-dark"
            >
              Start for free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;