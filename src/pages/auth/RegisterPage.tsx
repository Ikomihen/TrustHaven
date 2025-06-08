// trusthaven-frontend/src/pages/auth/RegisterPage.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Globe, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
// IMPORTANT: Ensure this imports your custom Axios instance from src/api/axios.js
import axios from '../../api/axios'; // Corrected import to use your custom instance

// Firebase Client SDK Imports
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  AuthError,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
// Import auth, db, AND firebaseConfig from your firebase.ts file
// Ensure this path (../../../firebase/firebase) is correct relative to RegisterPage.tsx
import { app, auth, db } from '../../firebase/firebase.ts';
import { UserRole } from '../../types'; // Ensure you have this type defined, e.g., export type UserRole = 'explorer' | 'pioneer' | 'guardian';

// Define a type for your form data
interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string; // This 'phone' is only used if registering via email/password
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  selectedRole: UserRole;
}

// Declare window.recaptchaVerifier globally for Firebase RecaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    // Add any other global properties if necessary
  }
}


const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for global toast messages (success/error)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Effect to hide the toast after a few seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage(null);
        setToastType(null);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Function to show toast
  const displayToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // State to manage which authentication method's UI is active
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email'); // 'email' or 'phone'

  // State for phone authentication specific inputs
  const [phoneInput, setPhoneInput] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);


  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    selectedRole: 'explorer', // Default to 'explorer' (User)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const navigate = useNavigate();

  // Helper function to create Firestore user profile after successful auth
  const createUserProfileInFirestore = async (
    uid: string,
    email: string | null,
    phoneNumber: string | null,
    displayName: string | null
  ) => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: uid,
        email: email,
        username: displayName || email?.split('@')[0] || phoneNumber || 'New User',
        phoneNumber: phoneNumber,
        role: formData.selectedRole, // Use the selected role from the form
        createdAt: Timestamp.now(),
        status: 'active',
      });
      console.log('User profile created in Firestore.');
    } else {
      console.log('Existing user profile found in Firestore, merging data.');
      // Update only if phone number or role is new/different, and last login
      await setDoc(userDocRef, {
        lastLogin: Timestamp.now(),
        phoneNumber: phoneNumber || userDocSnap.data().phoneNumber || null,
        role: userDocSnap.data().role || formData.selectedRole, // Keep existing role if present, otherwise set from form
      }, { merge: true });
    }
  };

  // Helper function for redirection based on role
  const redirectToDashboard = (role: UserRole) => {
    if (role === 'explorer') {
      navigate('/user-dashboard'); // Redirect to user dashboard
    } else if (role === 'pioneer') {
      navigate('/business-dashboard'); // Redirect to business dashboard
    } else {
      // Fallback for unexpected roles or guardians (who shouldn't register directly)
      console.warn(`Attempted to redirect user with role '${role}' to an unknown dashboard. Defaulting to login.`);
      navigate('/login');
    }
  };
// ... (Previous code including imports, state, handleChange, navigate,
  //          createUserProfileInFirestore, and redirectToDashboard) ...

  // --- Email/Password Registration (via Cloud Function) ---
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear form-specific errors

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      setIsLoading(false);
      return;
    }
    if (formData.selectedRole === 'guardian') {
      setError('Cannot register as a Guardian directly. Please contact support.');
      setIsLoading(false);
      return;
    }

    try {
      // Get projectId directly from firebaseConfig
      const projectId = firebaseConfig.projectId;
      if (!projectId) {
        throw new Error('Firebase Project ID is not configured in firebase.ts');
      }

      // Dynamically determine the Cloud Functions base URL (emulator vs. deployed)
      // This assumes 'us-central1' is your function's region. Adjust if different.
      const FUNCTIONS_BASE_URL = import.meta.env.PROD
        ? `https://${projectId}.cloudfunctions.net` // Production URL
        : `http://127.0.0.1:5001/${projectId}/us-central1`; // Local emulator URL for specific project/region

      // Construct the full Cloud Function URL for signup
      const FUNCTIONS_SIGNUP_URL = `${FUNCTIONS_BASE_URL}/signup`;

      // Use the 'axios' instance imported from '../../api/axios'
      const response = await axios.post(FUNCTIONS_SIGNUP_URL, {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        selectedRole: formData.selectedRole,
      });

      console.log('Registration successful:', response.data);
      displayToast('Account created successfully! Redirecting to dashboard...', 'success');
      // Redirect based on the role selected in the form
      redirectToDashboard(formData.selectedRole);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Log Axios error details for debugging
        const axiosErr = err as unknown;
        if (typeof axiosErr === 'object' && axiosErr !== null && 'response' in axiosErr && 'message' in axiosErr) {
          // TypeScript type guard for AxiosError
          const errorObj = axiosErr as { response?: { data?: { message?: string } }; message?: string; toJSON?: () => unknown };
          console.error('Registration failed (Axios Error):', errorObj.response?.data || errorObj.message, errorObj.toJSON?.());
          const errorMessage = errorObj.response?.data?.message || errorObj.message;
          setError(errorMessage || 'An error occurred.');
          displayToast(errorMessage || 'An error occurred.', 'error');
        } else {
          setError('Registration failed: An unknown error occurred.');
          displayToast('Registration failed: An unknown error occurred.', 'error');
        }
      } else {
        // Log generic error details
        console.error('Registration failed (Unexpected Error):', err);
        setError('Registration failed: An unexpected error occurred. Check console for details.');
        displayToast('Registration failed: An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Google Sign-up ---
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy before signing up with Google.');
      setIsLoading(false);
      return;
    }
    if (formData.selectedRole === 'guardian') {
      setError('Cannot register as a Guardian directly via Google Sign-up. Please contact support.');
      setIsLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user profile in Firestore
      await createUserProfileInFirestore(user.uid, user.email, user.phoneNumber, user.displayName);

      displayToast('Successfully signed up with Google! Redirecting to dashboard...', 'success');
      // Redirect based on the role selected in the form
      redirectToDashboard(formData.selectedRole);
    } catch (err) {
      const firebaseError = err as AuthError;
      console.error('Google registration failed:', firebaseError.message, firebaseError.code);
      let message = 'Google registration failed.';
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        message = 'Google sign-in popup was closed or cancelled.';
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        message = 'Google sign-in popup already open or cancelled.';
      } else if (firebaseError.code === 'auth/account-exists-with-different-credential') {
        message = 'An account with this email already exists using a different sign-in method. Try logging in with the existing method or linking accounts.';
      } else if (firebaseError.code === 'auth/network-request-failed') {
        message = 'Network error during Google sign-up. Check your internet connection.';
      } else if (firebaseError.code === 'auth/unauthorized-domain') {
        message = 'Google sign-in failed: Domain not authorized. Check Firebase Authentication settings.';
      } else if (firebaseError.code === 'auth/operation-not-supported-in-this-environment') {
        message = 'Google Sign-In is not enabled for your project or environment. Check Firebase Authentication settings.';
      }
      setError(message);
      displayToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phone Number (OTP) Sign-up - Step 1: Send OTP ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!phoneInput) {
      setError('Please enter your phone number.');
      setIsLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      setIsLoading(false);
      return;
    }
    if (formData.selectedRole === 'guardian') {
      setError('Cannot register as a Guardian directly via Phone Sign-up. Please contact support.');
      setIsLoading(false);
      return;
    }

    try {
      if (!recaptchaContainerRef.current) {
        throw new Error("reCAPTCHA container not found. It's required for phone authentication.");
      }

      // Clear any existing reCAPTCHA instance before creating a new one
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible', // Can be 'normal' for a visible captcha
        'callback': (response: unknown) => {
          console.log('reCAPTCHA solved:', response);
          // reCAPTCHA is solved, proceed with sending OTP
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired.');
          const msg = 'reCAPTCHA expired. Please try again.';
          setError(msg);
          displayToast(msg, 'error');
          setIsLoading(false);
        }
      });

      // Execute reCAPTCHA verification
      await window.recaptchaVerifier.verify();

      const confirmation = await signInWithPhoneNumber(auth, phoneInput, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      displayToast('OTP sent to your phone! Please enter it below.', 'success');
    } catch (err) {
      const firebaseError = err as AuthError;
      console.error('Error sending OTP:', firebaseError.message, firebaseError.code);
      let message = 'Failed to send OTP.';
      if (firebaseError.code === 'auth/too-many-requests') {
        message = 'Too many requests. Please try again later.';
      } else if (firebaseError.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number format. Please include country code (e.g., +2376xxxxxxxxx).';
      } else if (firebaseError.code === 'auth/quota-exceeded') {
        message = 'SMS quota exceeded. Please try again later.';
      } else if (firebaseError.code === 'auth/web-storage-unsupported') {
        message = 'Browser storage is disabled or unavailable, which is required for reCAPTCHA.';
      } else if (firebaseError.code === 'auth/missing-phone-number') {
        message = 'Phone number is missing.';
      } else if (firebaseError.code === 'auth/captcha-check-failed') {
        message = 'reCAPTCHA verification failed. Please try again.';
      }
      setError(message);
      displayToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phone Number (OTP) Sign-up - Step 2: Verify OTP ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!otp) {
      setError('Please enter the OTP.');
      setIsLoading(false);
      return;
    }
    if (!confirmationResult) {
      setError('No OTP was sent. Please send OTP first.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Create or update user profile in Firestore
      await createUserProfileInFirestore(user.uid, user.email, user.phoneNumber, formData.fullName);

      displayToast('Phone number verified and account created! Redirecting to dashboard...', 'success');
      // Redirect based on the role selected in the form
      redirectToDashboard(formData.selectedRole);
    } catch (err) {
      const firebaseError = err as AuthError;
      console.error('Error verifying OTP:', firebaseError.message, firebaseError.code);
      let message = 'Failed to verify OTP.';
      if (firebaseError.code === 'auth/invalid-verification-code') {
        message = 'Invalid OTP. Please check the code and try again.';
      } else if (firebaseError.code === 'auth/code-expired') {
        message = 'The OTP has expired. Please request a new one.';
      } else if (firebaseError.code === 'auth/user-disabled') {
        message = 'This user account has been disabled.';
      }
      setError(message);
      displayToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast && toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50
          ${toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toastType === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <p className="text-sm font-medium">{toastMessage}</p>
          <button onClick={() => setShowToast(false)} className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">TH</span>
          </div>
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900 flex items-center justify-center relative">
          <Link to="/" className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <User className="w-8 h-8 mr-2 text-gray-400" />
          Sign Up
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          {error && (
            <div className="text-red-600 text-sm text-center p-2 border border-red-300 rounded-md bg-red-50 mb-4">
              {error}
            </div>
          )}

          <p className="mt-2 mb-4 text-center text-md font-semibold text-gray-700">
            Sign Up as
          </p>

          <div className="mb-6 flex justify-center space-x-4">
            <Button
              type="button"
              variant={formData.selectedRole === 'explorer' ? 'default' : 'outline'}
              className="px-6 py-2"
              onClick={() => setFormData(prev => ({ ...prev, selectedRole: 'explorer' }))}
            >
              User
            </Button>
            <Button
              type="button"
              variant={formData.selectedRole === 'pioneer' ? 'default' : 'outline'}
              className="px-6 py-2"
              onClick={() => setFormData(prev => ({ ...prev, selectedRole: 'pioneer' }))}
            >
              Business
            </Button>
          </div>

          {authMethod === 'email' && (
            <form className="space-y-6" onSubmit={handleEmailPasswordSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number (Optional for Email/Password)
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                    required
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4"
                isLoading={isLoading}
              >
                {!isLoading && <ArrowRight className="w-5 h-5 mr-2" />}
                Register with Email
              </Button>
            </form>
          )}

          {authMethod === 'phone' && (
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div>
                <label htmlFor="fullNamePhone" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullNamePhone"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {!confirmationResult ? (
                <>
                  <div>
                    <label htmlFor="phoneInput" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phoneInput"
                        name="phoneInput"
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="+237 6XX XXX XXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="agreeToTermsPhone"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTermsPhone" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  <Button
                    type="button"
                    className="w-full flex justify-center py-2 px-4"
                    onClick={handleSendOtp}
                    isLoading={isLoading}
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="••••••"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full flex justify-center py-2 px-4"
                    onClick={handleVerifyOtp}
                    isLoading={isLoading}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
              {/* This div is crucial for reCAPTCHA to render correctly */}
              <div id="recaptcha-container" ref={recaptchaContainerRef} className="mt-4"></div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setAuthMethod('email');
                  setConfirmationResult(null);
                  setPhoneInput('');
                  setOtp('');
                  setError(null);
                  if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear(); // Clear reCAPTCHA when switching away
                  }
                }}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Email Registration
              </Button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                isLoading={isLoading}
              >
                {!isLoading && <Globe className="w-5 h-5 mr-2" />}
                Sign Up with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setAuthMethod('phone');
                  setError(null);
                  if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                  }
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Sign Up with Phone Number
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;