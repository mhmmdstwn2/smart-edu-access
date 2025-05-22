
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Masukkan email yang valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function LoginGuru() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null); // Reset any previous error
    
    try {
      await signIn(values.email, values.password);
      navigate("/dashboard/guru");
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // More specific error handling based on error message
      const errorMsg = error.message?.toLowerCase() || "";
      
      if (errorMsg.includes("invalid login credentials")) {
        setErrorMessage("Email atau password salah. Silakan periksa kembali.");
      } else if (errorMsg.includes("email") || errorMsg.includes("user")) {
        setErrorMessage("Email tidak terdaftar. Silakan daftar terlebih dahulu.");
      } else if (errorMsg.includes("password")) {
        setErrorMessage("Password salah. Silakan coba lagi.");
      } else if (errorMsg.includes("network") || errorMsg.includes("connection") || !navigator.onLine) {
        setErrorMessage("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      } else {
        setErrorMessage("Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold text-center">Login sebagai Guru</h1>
          <p className="text-center text-gray-500">
            Masukkan email dan password Anda untuk login
          </p>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nama@sekolah.ac.id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm mt-6">
          Belum punya akun?{" "}
          <a onClick={() => navigate("/register/guru")} className="text-primary underline cursor-pointer">
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
}
