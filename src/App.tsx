import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage'; // This is your content-only homepage
import ListingDetailsPage from './pages/listings/ListingDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BackToTopButton from './components/layout/BackToTop'; // Make sure this path is correct

// Import all the new page components based on your Navbar links
// IMPORTANT: You MUST create these files in your project at these relative paths.
// If your actual file structure is different, adjust these import paths accordingly.

// Public Pages (from src/pages/public/)
import AboutPage from './pages/public/AboutPage'; // Assuming AboutPage.tsx exists in src/pages/public/
import ContactPage from './pages/public/ContactPage';

// // Browse Pages (examples, adjust paths/names based on your actual files)
// import CategoriesPage from './pages/browse/CategoriesPage'; // e.g., src/pages/browse/CategoriesPage.tsx
// import AllListingsPage from './pages/listings/AllListingsPage'; // e.g., src/pages/listings/AllListingsPage.tsx

// // Features Pages (examples, adjust paths/names)
// import DashboardAnalyticsPage from './pages/features/DashboardAnalyticsPage'; // e.g., src/pages/features/DashboardAnalyticsPage.tsx
// import UserManagementPage from './pages/features/UserManagementPage';     // e.g., src/pages/features/UserManagementPage.tsx
// import RealtimeChatPage from './pages/features/RealtimeChatPage';         // e.g., src/pages/features/RealtimeChatPage.tsx
// import AdvancedReportingPage from './pages/features/AdvancedReportingPage'; // e.g., src/pages/features/AdvancedReportingPage.tsx

// // Pricing Pages (examples, adjust paths/names)
// import StandardPlansPage from './pages/pricing/StandardPlansPage'; // e.g., src/pages/pricing/StandardPlansPage.tsx
// import ProSubscriptionsPage from './pages/pricing/ProSubscriptionsPage';   // e.g., src/pages/pricing/ProSubscriptionsPage.tsx
// import CustomEnterprisePage from './pages/pricing/CustomEnterprisePage'; // e.g., src/pages/pricing/CustomEnterprisePage.tsx

// // Other specific pages
// import StartForFreePage from './pages/auth/StartForFreePage'; // e.g., src/pages/auth/StartForFreePage.tsx (or public)


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
          {/* Routes that do NOT include Navbar and Footer (e.g., login/register) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* This catch-all route renders Navbar and Footer for all other paths */}
          {/* Nested Routes are used here to handle all other application pages */}
          <Route
            path="*" // Matches any path not matched above
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  {/* ALL application pages (except login/register) go inside these nested Routes */}
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/listing/:id" element={<ListingDetailsPage />} />
                    
                    {/* ADDED ROUTES START HERE */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Browse Routes */}
                    {/* <Route path="/browse/categories" element={<CategoriesPage />} />
                    <Route path="/browse/listings" element={<AllListingsPage />} /> */}

                    {/* Features Routes */}
                    {/* <Route path="/features/dashboard" element={<DashboardAnalyticsPage />} />
                    <Route path="/features/users" element={<UserManagementPage />} />
                    <Route path="/features/chat" element={<RealtimeChatPage />} />
                    <Route path="/features/reports" element={<AdvancedReportingPage />} /> */}

                    {/* Pricing Routes */}
                    {/* <Route path="/pricing/standard" element={<StandardPlansPage />} />
                    <Route path="/pricing/pro" element={<ProSubscriptionsPage />} />
                    <Route path="/pricing/enterprise" element={<CustomEnterprisePage />} /> */}

                    {/* Start for Free Route */}
                    {/* <Route path="/start-for-free" element={<StartForFreePage />} /> */}

                    {/* Optional: Add a 404 Not Found page for paths not explicitly defined here */}
                    {/* This should be the last route in this nested Routes block */}
                    <Route path="*" element={<div><h1>404</h1><p>Page Not Found</p></div>} />
                    {/* ADDED ROUTES END HERE */}
                  </Routes>
                  <BackToTopButton />
                </main>
                <Footer />
              </>
            }
          />
          {/* Render the BackToTopButton here, outside of main content flow */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;