 import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Globe, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import axios from '../../api/axios';

// Firebase imports
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  updateProfile,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { UserRole } from '../../types';

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  selectedRole: UserRole;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Consolidated state
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    selectedRole: 'explorer',
  });
  
  const [state, setState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    isLoading: false,
    error: null as string | null,
    authMethod: 'email' as 'email' | 'phone',
    phoneInput: '',
    otp: '',
    confirmationResult: null as ConfirmationResult | null,
    toast: null as { message: string; type: 'success' | 'error' } | null,
  });

  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Auto-hide toast
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => setState(prev => ({ ...prev, toast: null })), 5000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  // Helper functions
  const showToast = (message: string, type: 'success' | 'error') => {
    setState(prev => ({ ...prev, toast: { message, type } }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const createUserProfile = async (uid: string, email: string | null, phoneNumber: string | null, displayName: string | null) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        uid,
        email,
        username: displayName || formData.fullName || email?.split('@')[0] || phoneNumber || 'New User',
        phoneNumber,
        role: formData.selectedRole,
        createdAt: Timestamp.now(),
        status: 'active',
        lastLogin: Timestamp.now(),
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, userData);
      } else {
        await setDoc(userRef, { lastLogin: Timestamp.now() }, { merge: true });
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const redirectToDashboard = (role: UserRole) => {
    const routes = {
      explorer: '/user-dashboard',
      pioneer: '/business-dashboard',
      guardian: '/login'
    };
    navigate(routes[role] || '/login');
  };

  const validateForm = () => {
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return false;
    }
    if (formData.selectedRole === 'guardian') {
      setError('Cannot register as a Guardian directly. Please contact support.');
      return false;
    }
    return true;
  };

  // Email/Password Registration - Fixed
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create user with Firebase Auth directly
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: formData.fullName
      });

      // Create user profile in Firestore
      await createUserProfile(user.uid, user.email, formData.phone || null, formData.fullName);

      showToast('Account created successfully!', 'success');
      setTimeout(() => redirectToDashboard(formData.selectedRole), 1500);
      
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'This email is already registered. Please use a different email or sign in.',
        'auth/weak-password': 'Password is too weak. Please use a stronger password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
      };
      
      const message = errorMessages[err.code] || err?.message || 'Registration failed. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-up - Simplified
  const handleGoogleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createUserProfile(user.uid, user.email, user.phoneNumber, user.displayName);
      showToast('Successfully signed up with Google!', 'success');
      setTimeout(() => redirectToDashboard(formData.selectedRole), 1500);
      
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {
        'auth/popup-closed-by-user': 'Sign-in popup was closed.',
        'auth/cancelled-popup-request': 'Sign-in was cancelled.',
        'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/unauthorized-domain': 'Domain not authorized for Google sign-in.',
      };
      
      const message = errorMessages[err.code] || 'Google sign-up failed. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP - Send (Fixed)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!state.phoneInput) {
      setError('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clear existing recaptcha
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }

      if (!recaptchaRef.current) {
        throw new Error('reCAPTCHA container not found.');
      }

      // Create new RecaptchaVerifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved'),
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
          setLoading(false);
        }
      });

      (window as any).recaptchaVerifier = recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, state.phoneInput, recaptchaVerifier);
      setState(prev => ({ ...prev, confirmationResult: confirmation }));
      showToast('OTP sent to your phone!', 'success');
      
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {
        'auth/too-many-requests': 'Too many requests. Please try again later.',
        'auth/invalid-phone-number': 'Invalid phone number format. Include country code (+237xxxxxxxxx).',
        'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
        'auth/captcha-check-failed': 'reCAPTCHA verification failed.',
      };
      
      const message = errorMessages[err.code] || 'Failed to send OTP. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP - Verify (Fixed)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.otp) {
      setError('Please enter the OTP.');
      return;
    }
    if (!state.confirmationResult) {
      setError('No OTP was sent. Please send OTP first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await state.confirmationResult.confirm(state.otp);
      const user = result.user;

      // Update profile with full name
      await updateProfile(user, {
        displayName: formData.fullName
      });

      await createUserProfile(user.uid, user.email, user.phoneNumber, formData.fullName);
      showToast('Phone verified and account created!', 'success');
      setTimeout(() => redirectToDashboard(formData.selectedRole), 1500);
      
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {
        'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
        'auth/code-expired': 'OTP has expired. Please request a new one.',
      };
      
      const message = errorMessages[err.code] || 'Failed to verify OTP. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setState(prev => ({
      ...prev,
      authMethod: 'email',
      confirmationResult: null,
      phoneInput: '',
      otp: '',
      error: null
    }));
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setState(prev => ({
      ...prev,
      [field === 'password' ? 'showPassword' : 'showConfirmPassword']: 
        !prev[field === 'password' ? 'showPassword' : 'showConfirmPassword']
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {state.toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50 ${
          state.toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {state.toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <p className="text-sm font-medium">{state.toast.message}</p>
          <button 
            onClick={() => setState(prev => ({ ...prev, toast: null }))} 
            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1"
          >
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
          {state.error && (
            <div className="text-red-600 text-sm text-center p-2 border border-red-300 rounded-md bg-red-50 mb-4">
              {state.error}
            </div>
          )}

          <p className="mt-2 mb-4 text-center text-md font-semibold text-gray-700">Sign Up as</p>

          {/* Role Selection */}
          <div className="mb-6 flex justify-center space-x-4">
            {(['explorer', 'pioneer'] as const).map((role) => (
              <Button
                key={role}
                type="button"
                variant={formData.selectedRole === role ? 'default' : 'outline'}
                className="px-6 py-2"
                onClick={() => setFormData(prev => ({ ...prev, selectedRole: role }))}
              >
                {role === 'explorer' ? 'User' : 'Business'}
              </Button>
            ))}
          </div>

          {/* Email Registration Form */}
          {state.authMethod === 'email' && (
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
              {/* Input Fields */}
              {[
                { name: 'fullName', type: 'text', icon: User, placeholder: 'John Doe', label: 'Full Name', required: true },
                { name: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com', label: 'Email', required: true },
                { name: 'phone', type: 'tel', icon: Phone, placeholder: '+237 6XX XXX XXX', label: 'Phone (Optional)', required: false },
              ].map(({ name, type, icon: Icon, placeholder, label, required }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                  <div className="mt-1 relative">
                    <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      id={name}
                      name={name}
                      type={type}
                      required={required}
                      value={formData[name as keyof RegisterFormData] as string}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}

              {/* Password Fields */}
              {[
                { name: 'password', label: 'Password', show: state.showPassword },
                { name: 'confirmPassword', label: 'Confirm Password', show: state.showConfirmPassword }
              ].map(({ name, label, show }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      id={name}
                      name={name}
                      type={show ? 'text' : 'password'}
                      required
                      value={formData[name as keyof RegisterFormData] as string}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(name as 'password' | 'confirmPassword')}
                      className="absolute right-3 top-2.5"
                    >
                      {show ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Terms Agreement */}
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-dark" target="_blank">Terms</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-dark" target="_blank">Privacy Policy</Link>
                </label>
              </div>

              <Button type="submit" className="w-full flex justify-center py-2 px-4" isLoading={state.isLoading}>
                {!state.isLoading && <ArrowRight className="w-5 h-5 mr-2" />}
                Register with Email
              </Button>
            </form>
          )}

          {/* Phone Registration Form */}
          {state.authMethod === 'phone' && (
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {!state.confirmationResult ? (
                <form onSubmit={handleSendOtp}>
                  {/* Phone Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={state.phoneInput}
                        onChange={(e) => setState(prev => ({ ...prev, phoneInput: e.target.value }))}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="+237 6XX XXX XXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-center mb-4">
                    <input
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:text-primary-dark" target="_blank">Terms</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary hover:text-primary-dark" target="_blank">Privacy Policy</Link>
                    </label>
                  </div>

                  <Button type="submit" className="w-full" isLoading={state.isLoading}>
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  {/* OTP Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                    <input
                      type="text"
                      value={state.otp}
                      onChange={(e) => setState(prev => ({ ...prev, otp: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" isLoading={state.isLoading}>
                    Verify OTP
                  </Button>
                </form>
              )}

              {/* reCAPTCHA container */}
              <div ref={recaptchaRef}></div>

              <Button type="button" variant="outline" className="w-full" onClick={resetPhoneAuth}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Email Registration
              </Button>
            </div>
          )}

          {/* Alternative Auth Methods */}
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
                isLoading={state.isLoading}
              >
                {!state.isLoading && <Globe className="w-5 h-5 mr-2" />}
                Sign Up with Google
              </Button>
              
              {state.authMethod === 'email' && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setState(prev => ({ ...prev, authMethod: 'phone' }))}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Sign Up with Phone Number
                </Button>
              )}
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
