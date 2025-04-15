
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginSiswa() {
  const [classId, setClassId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi login (akan diintegrasikan dengan Supabase nanti)
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard/siswa");
    }, 1500);
  };

  const handleQrScan = () => {
    setShowQrScanner(!showQrScanner);
    // Implementasi QR scanner akan ditambahkan nanti
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="classId">ID Kelas</Label>
        <Input
          id="classId"
          placeholder="Masukkan ID kelas dari guru Anda"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="studentName">Nama Siswa</Label>
        <Input
          id="studentName"
          placeholder="Masukkan nama lengkap Anda"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Masuk..." : "Masuk"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleQrScan}
        >
          <QrCode className="mr-2" size={18} />
          Scan QR Code Kelas
        </Button>
      </div>
      
      {showQrScanner && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
          <p className="text-sm text-gray-600">QR Scanner akan ditampilkan di sini</p>
          <p className="text-xs text-gray-500 mt-1">(Fitur QR Scanner akan diimplementasikan nanti)</p>
        </div>
      )}
    </form>
  );
}
