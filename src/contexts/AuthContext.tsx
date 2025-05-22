
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          console.log("Auth state changed:", event);
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check for internet connection
      if (!navigator.onLine) {
        throw new Error("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // More specific error handling
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email atau password salah");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Email belum dikonfirmasi. Silakan cek inbox email Anda");
        } else if (error.message.includes("Failed to fetch") || error.message.includes("fetch failed") || error.name === "AuthRetryableFetchError") {
          throw new Error("Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.");
        } else {
          throw error;
        }
      }
      
      if (!data.user) {
        throw new Error("Gagal mendapatkan informasi pengguna");
      }
      
      toast.success("Login berhasil!");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different types of errors
      let errorMessage = "Error saat login";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === "AuthRetryableFetchError" || error.name === "TypeError") {
        errorMessage = "Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.";
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Check for internet connection
      if (!navigator.onLine) {
        throw new Error("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("fetch failed") || error.name === "AuthRetryableFetchError") {
          throw new Error("Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.");
        } else if (error.message.includes("User already registered")) {
          throw new Error("Email sudah terdaftar. Silakan gunakan email lain atau lakukan login.");
        } else {
          throw error;
        }
      }
      
      toast.success("Pendaftaran berhasil! Silakan verifikasi email Anda.");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle different types of errors
      let errorMessage = "Error saat mendaftar";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === "AuthRetryableFetchError" || error.name === "TypeError") {
        errorMessage = "Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.";
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (!navigator.onLine) {
        throw new Error("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      }
      
      await supabase.auth.signOut();
      toast.success("Logout berhasil");
    } catch (error: any) {
      console.error("Logout error:", error);
      
      let errorMessage = "Error saat logout";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === "AuthRetryableFetchError" || error.name === "TypeError") {
        errorMessage = "Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.";
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
