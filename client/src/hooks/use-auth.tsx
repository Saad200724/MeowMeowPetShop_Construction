import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Add name property
  role?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
  authMethod: 'supabase' | 'fallback' | null;
  connectionStats: { total: number; supabase: number; fallback: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'meow_meow_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'supabase' | 'fallback' | null>(null);
  const [connectionStats, setConnectionStats] = useState({ total: 0, supabase: 0, fallback: 0 });

  useEffect(() => {
    // Check for existing session on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check localStorage for persisted user
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedStats = localStorage.getItem('connection_stats');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAuthMethod(parsedUser.authMethod || 'supabase');
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
      
      if (storedStats) {
        try {
          setConnectionStats(JSON.parse(storedStats));
        } catch (error) {
          console.error('Failed to parse connection stats:', error);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Try Supabase first
      const supabaseConnections = parseInt(localStorage.getItem('supabase_connections') || '0');
      let currentAuthMethod: 'supabase' | 'fallback' = 'supabase';
      
      if (supabaseConnections >= 190) {
        currentAuthMethod = 'fallback';
        console.log('Using fallback authentication due to connection limit');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, authMethod: currentAuthMethod }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setAuthMethod(data.authMethod || currentAuthMethod);
        
        // Update connection stats
        const stats = {
          total: connectionStats.total + 1,
          supabase: currentAuthMethod === 'supabase' ? connectionStats.supabase + 1 : connectionStats.supabase,
          fallback: currentAuthMethod === 'fallback' ? connectionStats.fallback + 1 : connectionStats.fallback
        };
        setConnectionStats(stats);
        localStorage.setItem('connection_stats', JSON.stringify(stats));
        
        // Persist user to localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...data.user, authMethod: currentAuthMethod }));
        console.log(`User signed in via ${currentAuthMethod}:`, data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Also remove any potential old auth keys for compatibility
    localStorage.removeItem('auth_user');
    console.log('User signed out and storage cleared');
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) {
      return { success: false, message: 'No user logged in' };
    }

    try {
      const response = await fetch(`/api/auth/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        // Update localStorage with new user data
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        console.log('Profile updated successfully:', updatedUser);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateProfile, loading, authMethod, connectionStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}