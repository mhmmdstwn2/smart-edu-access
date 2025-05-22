
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";

export function RegisterGuru() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, connectionStatus } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password harus sama");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare user metadata
      const userData = {
        name: formData.name,
        school: formData.school,
        role: "guru"
      };

      // Register the user with Supabase
      await signUp(formData.email, formData.password, userData);
      
      // Redirect to login page after successful registration
      toast.success("Pendaftaran berhasil! Silakan login dengan akun baru Anda.");
      navigate("/login/guru");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Connection status indicator */}
      <div className="mb-4">
        <Alert variant={connectionStatus === "connected" ? "default" : "destructive"} className="bg-opacity-80">
          {connectionStatus === "connected" ? (
            <div className="flex items-center text-green-600">
              <Wifi className="h-4 w-4 mr-2" />
              <AlertDescription>Terhubung ke database Supabase</AlertDescription>
            </div>
          ) : connectionStatus === "disconnected" ? (
            <div className="flex items-center">
              <WifiOff className="h-4 w-4 mr-2" />
              <AlertDescription>Tidak terhubung ke database Supabase. Periksa koneksi internet Anda.</AlertDescription>
            </div>
          ) : (
            <div className="flex items-center text-blue-600">
              <div className="h-4 w-4 mr-2 animate-pulse bg-blue-600 rounded-full"></div>
              <AlertDescription>Memeriksa koneksi ke database...</AlertDescription>
            </div>
          )}
        </Alert>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            placeholder="Nama lengkap Anda"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@sekolah.ac.id"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="school">Sekolah</Label>
          <Input
            id="school"
            placeholder="Nama sekolah tempat Anda mengajar"
            value={formData.school}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Masukkan password yang sama"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading || connectionStatus !== "connected"}>
          {isLoading ? "Mendaftar..." : "Daftar"}
        </Button>
        
        <div className="text-center text-sm">
          <p>
            Sudah punya akun?{" "}
            <Link to="/login/guru" className="text-primary hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
