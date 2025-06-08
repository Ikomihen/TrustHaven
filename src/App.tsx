import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ListingDetailsPage from './pages/listings/ListingDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AboutPage from './pages/public/AboutPage';

// Define CSS variables for our theme
const AppStyles = () => (
  <style>{`
    :root {
      --color-primary: #E25141;
      --color-primary-light: #e7756a;
      --color-primary-dark: #c73e30;
      
      --color-secondary: #E3CDBA;
      --color-accent-blue: #37bce5;
      --color-accent-yellow: #e8b974;
      
      --color-success: #4CAF50;
      --color-warning: #FF9800;
      --color-error: #F44336;
      
      --color-gray-50: #F9FAFB;
      --color-gray-100: #F3F4F6;
      --color-gray-200: #E5E7EB;
      --color-gray-300: #D1D5DB;
      --color-gray-400: #9CA3AF;
      --color-gray-500: #6B7280;
      --color-gray-600: #4B5563;
      --color-gray-700: #374151;
      --color-gray-800: #1F2937;
      --color-gray-900: #111827;
    }
    
    /* Tailwind extension */
    .bg-primary { background-color: var(--color-primary); }
    .bg-primary-light { background-color: var(--color-primary-light); }
    .bg-primary-dark { background-color: var(--color-primary-dark); }
    .bg-secondary { background-color: var(--color-secondary); }
    .bg-accent-blue { background-color: var(--color-accent-blue); }
    .bg-accent-yellow { background-color: var(--color-accent-yellow); }
    
    .text-primary { color: var(--color-primary); }
    .text-primary-light { color: var(--color-primary-light); }
    .text-primary-dark { color: var(--color-primary-dark); }
    .text-secondary { color: var(--color-secondary); }
    .text-accent-blue { color: var(--color-accent-blue); }
    .text-accent-yellow { color: var(--color-accent-yellow); }
    
    .border-primary { border-color: var(--color-primary); }
    .border-secondary { border-color: var(--color-secondary); }
    
    .fill-primary { fill: var(--color-primary); }
    
    /* Transitions */
    .transition-all { transition-property: all; }
    .transition-colors { transition-property: background-color, border-color, color, fill, stroke; }
    .transition-opacity { transition-property: opacity; }
    .transition-transform { transition-property: transform; }
    .duration-100 { transition-duration: 100ms; }
    .duration-200 { transition-duration: 200ms; }
    .duration-300 { transition-duration: 300ms; }
  `}</style>
);

function App() {
  return (
    <BrowserRouter>
      <AppStyles />
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/listing/:id" element={<ListingDetailsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;