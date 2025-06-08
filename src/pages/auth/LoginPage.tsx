import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Globe } from 'lucide-react'; // Added Phone and Globe icons
import { Button } from '../../components/ui/Button';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup, // Uncommented for Google
  GoogleAuthProvider, // Uncommented for Google
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { app, auth } from '../../firebase/firebase';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    phoneNumber: '',
    otp: '',
  });
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isPhoneAuth) {
        // Phone number login
        if (confirmationResult) {
          // Verify OTP
          await confirmationResult.confirm(formData.otp);
          console.log('Phone login success!');
          navigate('/dashboard'); // Example navigation
        } else {
          // Send OTP
          // Ensure recaptcha-container is visible and has a ref for RecaptchaVerifier
          const appVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
              size: 'invisible', // Can be 'normal' for visible widget
              callback: (response: unknown) => {
                // reCAPTCHA solved, this callback fires when the user is verified.
                // You can perform further actions here if needed, but for invisible, it's usually automatic.
                console.log('reCAPTCHA solved:', response);
              },
              'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                console.warn('reCAPTCHA expired. Please try again.');
                alert('reCAPTCHA expired. Please try again.');
                setIsLoading(false); // Stop loading if reCAPTCHA expires
              }
            },
            auth
          );

          await appVerifier.verify(); // Explicitly verify reCAPTCHA

          const result = await signInWithPhoneNumber(
            auth,
            formData.phoneNumber,
            appVerifier
          );
          setConfirmationResult(result);
          console.log('OTP sent!');
          alert('OTP sent to your phone! Please enter it.');
        }
      } else {
        // Email/password login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Email login success!');
        navigate('/dashboard'); // Example navigation
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
        alert(`Login failed: ${error.message}`);
      } else {
        console.error('Login failed:', error);
        alert('Login failed: An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('Google login success!');
      navigate('/dashboard'); // Example navigation
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Google login failed:', error.message);
        alert(`Google login failed: ${error.message}`);
      } else {
        console.error('Google login failed:', error);
        alert('Google login failed: An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">TH</span>
          </div>
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isPhoneAuth ? 'Login with Phone' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isPhoneAuth ? (
              <>
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) =>
                        setFormData({ ...formData, remember: e.target.checked })
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Phone Number Input for OTP */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute inset-y-0 left-0 pl-3 flex items-center h-5 w-5 text-gray-400" />
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="+1 555-123-4567"
                    />
                  </div>
                </div>

                {confirmationResult && (
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      OTP
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              isLoading={isLoading}
            >
              {!isLoading && <ArrowRight className="w-5 h-5 mr-2" />}
              {isPhoneAuth ? (confirmationResult ? 'Verify OTP' : 'Send OTP') : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-3"> {/* Changed to space-y for vertical stacking */}
              <Button
                type="button"
                variant="outline"
                className="w-full flex justify-center py-2 px-4 items-center"
                onClick={handleGoogleLogin}
                isLoading={isLoading} // Added isLoading for Google button
              >
                <Globe className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex justify-center py-2 px-4 items-center"
                onClick={() => {
                  setIsPhoneAuth((prev) => !prev);
                  // Reset form data and confirmation result when toggling
                  setFormData({ ...formData, email: '', password: '', phoneNumber: '', otp: '' });
                  setConfirmationResult(null);
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                {isPhoneAuth ? 'Use Email/Password' : 'Sign in with Phone/OTP'}
              </Button>
            </div>
          </div>
          {/* reCAPTCHA container - MUST BE PRESENT for Phone Auth */}
          {/* It's usually invisible, so styling for display isn't strictly needed for default setup */}
          <div id="recaptcha-container" className="mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;