import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginFormData, SignupFormData } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['customer', 'owner']).default('customer'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthMode = 'login' | 'signup';

const GoogleIcon: React.FC = () => (
  <svg className="auth__social-icon" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const { login, signup, loginDemo, isLoading, error } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Real-time password confirmation validation
  const checkPasswordMatch = () => {
    const password = signupForm.watch('password');
    const confirmPassword = signupForm.watch('confirmPassword');
    
    if (confirmPassword && password) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      await signup(data);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Google sign-in implementation will be added here
      console.log('Google sign-in clicked');
      toast.success('Google sign-in coming soon!');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="auth">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth__container"
      >
        <div className="auth__card">
          <div className="auth__header">
            <div className="auth__logo">
              <img 
                src="/assets/images/logo.png" 
                alt="RIBA Logo" 
                className="auth__logo-image"
              />
            </div>
            <h1 className="auth__title">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="auth__subtitle">
              {mode === 'login' ? 'Sign in to manage your store' : 'Start your journey with RIBA'}
            </p>
          </div>

          {/* Social & Demo Actions */}
          <div className="auth__social">
            <div style={{ display: 'grid', gap: '12px' }}>
              <button
                onClick={handleGoogleSignIn}
                className="auth__social-button"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={loginDemo}
                className="auth__demo-button"
                aria-label="Try demo as Amina Bello"
              >
                <span aria-hidden>🚀</span>
                Try Demo (Amina Bello)
              </button>
            </div>
            
            <div className="auth__divider">
              <span className="auth__divider-text">or continue with email</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="auth__form"
              >
                <div className="auth__form-group">
                  <label htmlFor="email" className="auth__label">
                    Email Address
                  </label>
                  <div className="auth__input-wrapper">
                    <Mail className="auth__icon" aria-hidden="true" />
                    <input
                      {...loginForm.register('email')}
                      type="email"
                      id="email"
                      className="auth__input"
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-describedby="email-error"
                      aria-invalid={!!loginForm.formState.errors.email}
                      required
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <motion.p
                      id="email-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="auth__error-message"
                      role="alert"
                      aria-live="polite"
                    >
                      {loginForm.formState.errors.email.message}
                    </motion.p>
                  )}
                </div>

                <div className="auth__form-group">
                  <label htmlFor="password" className="auth__label">
                    Password
                  </label>
                  <div className="auth__input-wrapper">
                    <Lock className="auth__icon" aria-hidden="true" />
                    <input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="auth__input"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-describedby="password-error"
                      aria-invalid={!!loginForm.formState.errors.password}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth__toggle-password"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="auth__icon auth__icon--small" /> : <Eye className="auth__icon auth__icon--small" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <motion.p
                      id="password-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="auth__error-message"
                      role="alert"
                      aria-live="polite"
                    >
                      {loginForm.formState.errors.password.message}
                    </motion.p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="auth__error"
                    role="alert"
                    aria-live="assertive"
                  >
                    <p className="auth__error-text">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`auth__submit ${isLoading ? 'auth__submit--loading' : ''}`}
                  aria-busy={isLoading}
                  aria-label={isLoading ? 'Signing in, please wait' : 'Sign in to your account'}
                >
                  {isLoading ? (
                    <>
                      <div className="auth__spinner" aria-hidden="true" />
                      <span aria-label="Signing in">Signing in...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="auth__form"
              >
                <div className="auth__form-row">
                  <div className="auth__form-group">
                    <label htmlFor="name" className="auth__label">
                      Full Name *
                    </label>
                    <div className="auth__input-wrapper">
                      <User className="auth__icon" />
                      <input
                        {...signupForm.register('name')}
                        type="text"
                        id="name"
                        className="auth__input"
                        placeholder="Enter your name"
                        autoComplete="name"
                      />
                    </div>
                    {signupForm.formState.errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth__error-message"
                      >
                        {signupForm.formState.errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="auth__form-group">
                    <label htmlFor="phone" className="auth__label">
                      Phone Number
                    </label>
                    <div className="auth__input-wrapper">
                      <Phone className="auth__icon" />
                      <input
                        {...signupForm.register('phone')}
                        type="tel"
                        id="phone"
                        className="auth__input"
                        placeholder="Enter phone (optional)"
                        autoComplete="tel"
                      />
                    </div>
                    {signupForm.formState.errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth__error-message"
                      >
                        {signupForm.formState.errors.phone.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="auth__field">
                  <label htmlFor="email" className="auth__label">
                    Email Address *
                  </label>
                  <div className="auth__input-wrapper">
                    <Mail className="auth__icon" />
                    <input
                      {...signupForm.register('email')}
                      type="email"
                      id="email"
                      className="auth__input"
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="auth__error-message"
                    >
                      {signupForm.formState.errors.email.message}
                    </motion.p>
                  )}
                </div>

                <div className="auth__form-group">
                  <label className="auth__label">
                    I am signing up as *
                  </label>
                  <div className="auth__radio-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', marginTop: '8px' }}>
                    <label className="auth__radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        {...signupForm.register('role')}
                        type="radio"
                        value="customer"
                        className="auth__radio-input"
                        style={{ marginRight: '8px' }}
                      />
                      <span>Customer (Shop & Order)</span>
                    </label>
                    <label className="auth__radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        {...signupForm.register('role')}
                        type="radio"
                        value="owner"
                        className="auth__radio-input"
                        style={{ marginRight: '8px' }}
                      />
                      <span>Business Owner (Sell Products)</span>
                    </label>
                  </div>
                  {signupForm.formState.errors.role && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="auth__error-message"
                    >
                      {signupForm.formState.errors.role.message}
                    </motion.p>
                  )}
                </div>

                <div className="auth__form-row">
                  <div className="auth__form-group">
                    <label htmlFor="password" className="auth__label">
                      Password *
                    </label>
                    <div className="auth__input-wrapper">
                      <Lock className="auth__icon" />
                      <input
                        {...signupForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="auth__input"
                        placeholder="Create password"
                        autoComplete="new-password"
                        onChange={() => {
                          checkPasswordMatch();
                          signupForm.trigger('confirmPassword');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="auth__toggle-password"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="auth__icon auth__icon--small" /> : <Eye className="auth__icon auth__icon--small" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth__error-message"
                      >
                        {signupForm.formState.errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="auth__form-group">
                    <label htmlFor="confirmPassword" className="auth__label">
                      Confirm Password *
                    </label>
                    <div className="auth__input-wrapper">
                      <Lock className="auth__icon" />
                      <input
                        {...signupForm.register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className="auth__input"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        onChange={checkPasswordMatch}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="auth__toggle-password"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="auth__icon auth__icon--small" /> : <Eye className="auth__icon auth__icon--small" />}
                      </button>
                      {passwordMatch !== null && (
                        <div className="auth__validation-icon">
                          {passwordMatch ? (
                            <Check className="auth__icon auth__icon--small auth__icon--success" />
                          ) : (
                            <X className="auth__icon auth__icon--small auth__icon--error" />
                          )}
                        </div>
                      )}
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth__error-message"
                      >
                        {signupForm.formState.errors.confirmPassword.message}
                      </motion.p>
                    )}
                    {passwordMatch === true && !signupForm.formState.errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth__success-message"
                      >
                        Passwords match!
                      </motion.p>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="auth__error"
                  >
                    <p className="auth__error-text">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`auth__submit ${isLoading ? 'auth__submit--loading' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="auth__spinner" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="auth__toggle">
            <p className="auth__toggle-text">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="auth__toggle-link"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            
            {mode === 'signup' && (
              <p className="auth__legal">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};