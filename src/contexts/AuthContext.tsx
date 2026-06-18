import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User, AuthState, LoginFormData, SignupFormData } from '@/types';
import { supabase } from '@/lib/supabase';
import { mapProfileToUser, type ProfileRow } from '@/lib/mappers';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  loginDemo: (role?: User['role']) => Promise<void>;
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

// Seeds a demo owner with one store and a few products so "Demo Store
// Owner" lands on a populated, working dashboard instead of an empty
// onboarding form. Best-effort: if it fails, the demo account still works,
// it just lands on /onboarding like any other new owner.
const provisionDemoStore = async (ownerId: string) => {
  try {
    const slug = `demo-store-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        owner_id: ownerId,
        name: "Amina's Fashion Hub",
        business_name: "Amina's Fashion Hub",
        business_type: 'products',
        description: 'A demo storefront seeded automatically so you can explore the owner dashboard right away.',
        phone: '+234 800 000 0000',
        address: '12 Allen Avenue',
        city: 'Lagos',
        state: 'Lagos',
        slug,
        theme_color: '#0B6E4F',
      })
      .select('id')
      .single();
    if (storeError || !store) return;

    await supabase.from('products').insert([
      {
        store_id: store.id,
        name: 'Ankara Print Dress',
        description: 'Vibrant Ankara print dress with a tailored fit.',
        price: 12000,
        currency: 'NGN',
        images: [],
        category: 'Fashion',
        stock: 10,
        availability: true,
      },
      {
        store_id: store.id,
        name: 'Beaded Necklace Set',
        description: 'Handmade beaded necklace and earring set.',
        price: 4500,
        currency: 'NGN',
        images: [],
        category: 'Accessories',
        stock: 20,
        availability: true,
      },
      {
        store_id: store.id,
        name: 'Woven Tote Bag',
        description: 'Durable woven tote bag, perfect for everyday use.',
        price: 8000,
        currency: 'NGN',
        images: [],
        category: 'Accessories',
        stock: 15,
        availability: true,
      },
    ]);
  } catch {
    // Demo account still logs in fine without a seeded store.
  }
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

  const loginDemo = async (role: User['role'] = 'owner') => {
    dispatch({ type: 'AUTH_START' });
    try {
      const email = `demo-${role}-${Date.now()}@riba.demo`;
      const password = crypto.randomUUID();
      const name = role === 'owner' ? 'Amina Bello' : 'Demo Customer';

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });
      if (error) throw error;
      if (!signUpData.session || !signUpData.user) {
        throw new Error('Demo signup requires email confirmation to be disabled for this project.');
      }

      const user = await fetchProfile(signUpData.user.id);

      // A demo owner with no store would just land on the onboarding form,
      // which defeats the point of a one-click demo - seed a store and a
      // few products so they land straight on a populated dashboard.
      if (role === 'owner') {
        await provisionDemoStore(user.id);
      }

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: signUpData.session.access_token } });
      toast.success('Exploring demo mode');
      navigate('/dashboard');
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
