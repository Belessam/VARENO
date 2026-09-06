/**
 * VARENO Auth Context
 *
 * Manages Supabase Auth session state and admin role verification.
 * Provides: user, session, profile, isAdmin, loading, signIn, signOut.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  role: string;
  full_name: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    console.log("[Auth] fetchProfile for user:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("[Auth] fetchProfile error:", error.message, "code:", error.code);
    } else {
      console.log("[Auth] fetchProfile success, role:", data?.role);
    }
    setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("[Auth] Initializing auth state...");
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      console.log("[Auth] Initial session:", !!s, "user:", s?.user?.id);
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      console.log("[Auth] onAuthStateChange:", event, "session:", !!s);
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setLoading(true);
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      console.log("[Auth] signIn called for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("[Auth] signIn error:", error.message, "status:", error.status);
        return { error: error.message };
      }
      console.log("[Auth] signIn success, user:", data.user?.id, "session:", !!data.session);
      return {};
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin: profile?.role === "admin",
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
