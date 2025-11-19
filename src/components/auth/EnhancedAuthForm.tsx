import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Eye, EyeOff, Chrome, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationContext } from '@/contexts/NavigationContext';
import { useNavigation } from '@/hooks/useNavigation';

// Enhanced validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  role: z.enum(['customer', 'owner']).default('customer'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthMode = 'login' | 'signup' | 'forgot';



export const EnhancedAuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { login, signup, loginDemo, isLoading: authLoading } = useAuth();
  const { goBack } = useNavigationContext();
  const { navigateTo } = useNavigation();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      acceptTerms: false,
    },
  });

  // Password strength calculation
  useEffect(() => {
    const password = signupForm.watch('password');
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [signupForm.watch('password')]);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      
      // Navigate to dashboard or intended route
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      navigateTo(returnUrl || '/dashboard');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      await signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
      });
      
      // Navigate to onboarding or dashboard
      navigateTo('/onboarding');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Google sign-in implementation
    console.log('Google sign-in initiated');
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setFormError(null);
    
    // Reset forms when switching modes
    if (newMode === 'login') {
      signupForm.reset();
    } else if (newMode === 'signup') {
      loginForm.reset();
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button for mobile */}
        <div className="mb-4 md:hidden">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <img 
                  src="/assets/images/logo.png" 
                  alt="RIBA" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.h1
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </motion.h1>
              
              <motion.p
                key={`${mode}-subtitle`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600"
              >
                {mode === 'login' && 'Sign in to manage your store'}
                {mode === 'signup' && 'Start your journey with RIBA'}
                {mode === 'forgot' && 'Enter your email to reset your password'}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <p className="text-red-700 text-sm">{formError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-6"
                noValidate
              >
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...loginForm.register('email')}
                      type="email"
                      id="login-email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={!!loginForm.formState.errors.email}
                      aria-describedby={loginForm.formState.errors.email ? 'login-email-error' : undefined}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p id="login-email-error" className="mt-2 text-sm text-red-600" role="alert">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={!!loginForm.formState.errors.password}
                      aria-describedby={loginForm.formState.errors.password ? 'login-password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p id="login-password-error" className="mt-2 text-sm text-red-600" role="alert">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      {...loginForm.register('rememberMe')}
                      type="checkbox"
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleMode('forgot')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 focus:outline-none focus:text-emerald-700"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  aria-busy={isLoading || authLoading}
                >
                  {isLoading || authLoading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Demo Login */}
                <button
                  type="button"
                  onClick={loginDemo}
                  disabled={isLoading || authLoading}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  Try Demo (Amina Bello)
                </button>
              </motion.form>
            )}

            {mode === 'signup' && (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-6"
                noValidate
              >
                {/* Name Field */}
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...signupForm.register('name')}
                      type="text"
                      id="signup-name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      aria-invalid={!!signupForm.formState.errors.name}
                      aria-describedby={signupForm.formState.errors.name ? 'signup-name-error' : undefined}
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p id="signup-name-error" className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...signupForm.register('email')}
                      type="email"
                      id="signup-email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={!!signupForm.formState.errors.email}
                      aria-describedby={signupForm.formState.errors.email ? 'signup-email-error' : undefined}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p id="signup-email-error" className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...signupForm.register('phone')}
                      type="tel"
                      id="signup-phone"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      aria-invalid={!!signupForm.formState.errors.phone}
                      aria-describedby={signupForm.formState.errors.phone ? 'signup-phone-error' : undefined}
                    />
                  </div>
                  {signupForm.formState.errors.phone && (
                    <p id="signup-phone-error" className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...signupForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      aria-invalid={!!signupForm.formState.errors.password}
                      aria-describedby={signupForm.formState.errors.password ? 'signup-password-error' : 'password-strength'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {passwordStrength > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength <= 25 ? 'text-red-600' :
                          passwordStrength <= 50 ? 'text-orange-600' :
                          passwordStrength <= 75 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                          aria-valuenow={passwordStrength}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          role="progressbar"
                        />
                      </div>
                    </div>
                  )}
                  
                  {signupForm.formState.errors.password && (
                    <p id="signup-password-error" className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                  <p id="password-strength" className="sr-only">
                    Password strength: {getPasswordStrengthText()}
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      {...signupForm.register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="signup-confirm-password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      aria-invalid={!!signupForm.formState.errors.confirmPassword}
                      aria-describedby={signupForm.formState.errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p id="signup-confirm-password-error" className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am signing up as *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...signupForm.register('role')}
                        type="radio"
                        value="customer"
                        className="border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Customer (Shop & Order)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...signupForm.register('role')}
                        type="radio"
                        value="owner"
                        className="border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Business Owner (Sell Products)</span>
                    </label>
                  </div>
                  {signupForm.formState.errors.role && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start">
                    <input
                      {...signupForm.register('acceptTerms')}
                      type="checkbox"
                      className="mt-1 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      aria-invalid={!!signupForm.formState.errors.acceptTerms}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I accept the <a href="#" className="text-emerald-600 hover:text-emerald-700 underline">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</a>
                    </span>
                  </label>
                  {signupForm.formState.errors.acceptTerms && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {signupForm.formState.errors.acceptTerms.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  aria-busy={isLoading || authLoading}
                >
                  {isLoading || authLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                aria-label="Sign in with Google"
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => toggleMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none focus:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            
            {mode === 'signup' && (
              <p className="mt-2 text-xs text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};