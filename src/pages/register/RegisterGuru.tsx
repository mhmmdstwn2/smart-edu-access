
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

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
      alert("Password dan konfirmasi password harus sama");
      return;
    }
    
    setIsLoading(true);
    
    // Simulasi registrasi (akan diintegrasikan dengan Supabase nanti)
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard/guru");
    }, 1500);
  };

  return (
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
      
      <Button type="submit" className="w-full" disabled={isLoading}>
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
  );
}
