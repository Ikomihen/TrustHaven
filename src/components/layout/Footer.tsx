import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send
} from 'lucide-react';
import Logo from './Logo'; // Assuming Logo is a component for your brand logo
import { Button } from '../ui/Button'; // Assuming you have a Button component

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-200 pt-16 pb-8 border-t border-gray-800 shadow-inner">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 lg:gap-x-12">

          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-4">
              <Logo className="h-10 w-auto" /> {/* Assuming Logo takes a className prop */}
              <span className="ml-3 text-2xl font-extrabold text-white tracking-tight">TrustHaven</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted platform for verified listings of homes, cars, and services across Cameroon. Quality and security, guaranteed.
            </p>
            <div className="flex space-x-5">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300 transform hover:scale-110"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <Twitter size={22} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-3 inline-block">Quick Links</h3>
            <ul className="space-y-3 mt-4">
              {['Home', 'About', 'Listings', 'Contact', 'FAQ', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-base"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-3 inline-block">Categories</h3>
            <ul className="space-y-3 mt-4">
              {['Homes', 'Cars', 'Services', 'Businesses', 'Jobs', 'Electronics'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/category/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-base"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-3 inline-block">Stay Connected</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Subscribe to our newsletter to receive the latest listings, exclusive deals, and market insights directly in your inbox.
            </p>
            <div className="flex w-full max-w-sm mb-8">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-2.5 px-4 text-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-100 placeholder-gray-500"
                aria-label="Email for newsletter"
              />
              <Button
                variant="default"
                className="rounded-l-none bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 transition-colors duration-300"
                aria-label="Subscribe to newsletter"
              >
                <Send size={18} />
              </Button>
            </div>
            
            <div className="space-y-4 w-full max-w-sm">
              <div className="flex items-start text-left">
                <Mail size={18} className="text-teal-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-base break-all">contact@trusthaven.cm</span>
              </div>
              <div className="flex items-start text-left">
                <Phone size={18} className="text-teal-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-base">+237 670 123 456</span>
              </div>
              <div className="flex items-start text-left">
                <MapPin size={18} className="text-teal-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-base">Molyko, Buea, Southwest Region, Cameroon</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Copyright and Legal Links --- */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              &copy; {year} <span className="font-semibold text-white">TrustHaven</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-teal-400 transition-colors duration-300">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-teal-400 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-teal-400 transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;