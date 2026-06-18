import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User, AuthState, LoginFormData, SignupFormData } from '@/types';
import { supabase } from '@/lib/supabase';
import { mapProfileToUser, type ProfileRow } from '@/lib/mappers';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string | null } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_CHECK_COMPLETE' }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_CHECK_COMPLETE':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchProfile = async (userId: string): Promise<User> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return mapProfileToUser(data as ProfileRow);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // After login/signup, return to wherever the user was headed (e.g. a
  // ProtectedRoute or checkout bounced them here with state: { from }),
  // falling back to the role-based default landing page.
  const redirectAfterAuth = (role: User['role']) => {
    const from = (location.state as { from?: { pathname: string; search: string } } | null)?.from;
    if (from?.pathname) {
      navigate(`${from.pathname}${from.search || ''}`, { replace: true });
      return;
    }
    navigate(role === 'owner' ? '/onboarding' : '/dashboard');
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        dispatch({ type: 'AUTH_CHECK_COMPLETE' });
        return;
      }
      try {
        const user = await fetchProfile(session.user.id);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: session.access_token } });
      } catch {
        dispatch({ type: 'AUTH_CHECK_COMPLETE' });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        dispatch({ type: 'LOGOUT' });
        return;
      }
      try {
        const user = await fetchProfile(session.user.id);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: session.access_token } });
      } catch {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to load profile' });
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const login = async (data: LoginFormData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;

      const user = await fetchProfile(signInData.user.id);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: signInData.session.access_token } });
      toast.success('Login successful!');
      redirectAfterAuth(user.role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const signup = async (data: SignupFormData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const role = data.role || 'customer';
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name, phone: data.phone, role },
        },
      });
      if (error) throw error;

      if (!signUpData.session || !signUpData.user) {
        dispatch({ type: 'AUTH_CHECK_COMPLETE' });
        toast.success('Account created! Check your email to confirm before signing in.');
        navigate('/auth');
        return;
      }

      const user = await fetchProfile(signUpData.user.id);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: signUpData.session.access_token } });
      toast.success('Account created successfully!');
      redirectAfterAuth(user.role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const loginDemo = async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      const email = `demo-${Date.now()}@riba.demo`;
      const password = crypto.randomUUID();

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: 'Demo User', role: 'owner' },
        },
      });
      if (error) throw error;
      if (!signUpData.session || !signUpData.user) {
        throw new Error('Demo signup requires email confirmation to be disabled for this project.');
      }

      const user = await fetchProfile(signUpData.user.id);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: signUpData.session.access_token } });
      toast.success('Exploring demo mode');
      redirectAfterAuth(user.role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Demo login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
    navigate('/');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    loginDemo,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
