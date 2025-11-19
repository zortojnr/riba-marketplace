import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, AuthState, LoginFormData, SignupFormData } from '@/types';
import { apiClient } from '@/utils/api';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
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
    case 'LOGOUT':
      return initialState;
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Load auth data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('riba_token');
    const user = localStorage.getItem('riba_user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        apiClient.setToken(token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: parsedUser, token },
        });
      } catch (error) {
        localStorage.removeItem('riba_token');
        localStorage.removeItem('riba_user');
      }
    }
  }, []);

  const login = async (data: LoginFormData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiClient.login(data.email, data.password);
      const { user, token } = response.data as { user: User; token: string };
      
      localStorage.setItem('riba_token', token);
      localStorage.setItem('riba_user', JSON.stringify(user));
      apiClient.setToken(token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
      
      toast.success('Login successful!');
      
      // Redirect based on user role and store setup status
      if (user.role === 'owner') {
        navigate('/onboarding');
      } else {
        // Customers go directly to browse stores/products
        navigate('/stores');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const signup = async (data: SignupFormData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const signupData = {
        ...data,
        role: data.role || 'customer'
      };
      const response = await apiClient.signup(signupData);
      const { user, token } = response.data as { user: User; token: string };
      
      localStorage.setItem('riba_token', token);
      localStorage.setItem('riba_user', JSON.stringify(user));
      apiClient.setToken(token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
      
      toast.success('Account created successfully!');
      
      // Redirect based on user role
      if (user.role === 'owner') {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const googleLogin = async (token: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiClient.googleLogin(token);
      const { user, accessToken } = response.data as { user: User; accessToken: string };
      
      localStorage.setItem('riba_token', accessToken);
      localStorage.setItem('riba_user', JSON.stringify(user));
      apiClient.setToken(accessToken);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: accessToken },
      });
      
      toast.success('Login successful!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const loginDemo = async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      const demoUser: User = {
        id: 'demo-user-001',
        email: 'demo@riba.local',
        phone: '+2348000000000',
        name: 'Demo User',
        avatar: undefined,
        role: 'owner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const demoToken = 'demo-token';

      localStorage.setItem('riba_token', demoToken);
      localStorage.setItem('riba_user', JSON.stringify(demoUser));
      apiClient.setToken(demoToken);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: demoUser, token: demoToken },
      });

      toast.success('Exploring demo mode');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Demo login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('riba_token');
    localStorage.removeItem('riba_user');
    apiClient.setToken(null);
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    googleLogin,
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