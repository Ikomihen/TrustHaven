import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  MessageSquare,
  BarChart,
  CreditCard,
  DollarSign,
  Building,
  List,
  Grid,
} from 'lucide-react';

import { Button } from '../ui/Button';
import Logo from './Logo';

interface DropdownLink {
  name: string;
  path: string;
  icon?: React.ElementType;
  description?: string;
}

const SimpleDropdown = ({ links }: { links: DropdownLink[] }) => (
  <div
    className="absolute left-0 mt-4 w-[30rem] bg-gray-50 rounded-lg shadow-xl py-4 z-50
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               transition-all duration-300 ease-out transform origin-top scale-y-0 translate-y-2 group-hover:scale-y-100 group-hover:translate-y-0"
  >
    {links.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className="flex items-start px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-pink-700 transition-all duration-200 group
                   hover:translate-x-2 hover:shadow-md transform hover:scale-[1.01]"
      >
        {link.icon && (
          <link.icon className="w-7 h-7 mr-4 mt-0.5 text-gray-600 group-hover:text-pink-600 transition-colors duration-200 flex-shrink-0" />
        )}
        <div>
          <span className="block text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-200">
            {link.name}
          </span>
          {link.description && (
            <span className="block text-base text-gray-500 mt-1 leading-normal">
              {link.description}
            </span>
          )}
        </div>
      </Link>
    ))}
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setOpenMobileDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMobileDropdown(null);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenMobileDropdown(null);
  };

  const handleMobileDropdownToggle = (path: string) => {
    setOpenMobileDropdown(prevPath => (prevPath === path ? null : path));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    {
      name: 'Browse',
      path: '/browse',
      dropdownLinks: [
        { name: 'Categories', path: '/browse/categories', icon: List, description: 'Explore items by category.' },
        { name: 'All Listings', path: '/browse/listings', icon: Grid, description: 'View all available listings.' },
        { name: 'Dashboard Analytics', path: '/features/dashboard', icon: LayoutDashboard, description: 'Gain powerful insights with intuitive dashboards.' },
        { name: 'User Management', path: '/features/users', icon: User, description: 'Efficiently manage user roles and permissions.' },
        { name: 'Real-time Chat', path: '/features/chat', icon: MessageSquare, description: 'Communicate instantly with your team or customers.' },
        { name: 'Advanced Reporting', path: '/features/reports', icon: BarChart, description: 'Generate detailed reports for informed decisions.' },
      ],
    },
    {
      name: 'Pricing',
      path: '/pricing',
      dropdownLinks: [
        { name: 'Standard Plans', path: '/pricing/standard', icon: CreditCard, description: 'Flexible plans to fit your individual or small team needs.' },
        { name: 'Pro Subscriptions', path: '/pricing/pro', icon: DollarSign, description: 'Unlock advanced features for growing businesses.' },
        { name: 'Custom Enterprise', path: '/pricing/enterprise', icon: Building, description: 'Tailored solutions and dedicated support for large organizations.' },
      ],
    },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 mb-4">
      <div
        className="w-full bg-white shadow-[0_4px_20px_-4px_rgba(239,68,68,0.3)] rounded-b-3xl
                   flex items-center justify-between px-6 py-4"
      >
        <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
          <Logo />
        </Link>

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

        <div className="hidden md:flex items-center">
          <Link to="/start-for-free">
            <Button
              variant="default"
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold
                         py-3 px-8 rounded-full text-base tracking-wide
                         transition-colors duration-200"
            >
              Start for free
            </Button>
          </Link>
        </div>

        <button
          ref={buttonRef}
          className="md:hidden p-2 rounded-md text-gray-800 transition-transform duration-300 active:scale-95"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="w-6 h-0.5 bg-gray-800 rounded-full"></div>
              <div className="w-3 h-0.5 bg-gray-800 rounded-full ml-auto"></div>
              <div className="w-6 h-0.5 bg-gray-800 rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenMobileDropdown(null);
            }}
          />
          <div
            ref={menuRef}
            className="md:hidden fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white z-50 p-4 pt-12 shadow-lg overflow-y-auto
                     transform transition-transform duration-300 ease-out"
          >
            <button
              className="absolute top-4 right-4 p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200"
              onClick={() => {
                setIsMenuOpen(false);
                setOpenMobileDropdown(null);
              }}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

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
                      <div className="pl-6 pt-2 pb-2 bg-gray-50 rounded-md">
                        <ul className="space-y-1">
                          {link.dropdownLinks.map((subLink) => (
                            <li key={subLink.path}>
                              <Link
                                to={subLink.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-start text-gray-700 hover:text-pink-500 hover:bg-gray-100 p-2 rounded-md text-sm transition-colors duration-200"
                              >
                                {subLink.icon && (
                                  <subLink.icon className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                )}
                                <div>
                                  <span className="block font-medium text-gray-800">{subLink.name}</span>
                                  {subLink.description && (
                                    <span className="block text-xs text-gray-500 leading-tight">
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
                className="block w-full text-center py-5 px-8 bg-primary text-white font-bold text-xl rounded-full"
                style={{ marginBottom: '1.5rem' }}
              >
                Start for free
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;