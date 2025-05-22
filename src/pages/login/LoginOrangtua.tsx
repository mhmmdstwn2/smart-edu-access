
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LoginOrangtua() {
  const [isLoading, setIsLoading] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleQrScan = () => {
    setShowQrScanner(true);
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Check for internet connection
      if (!navigator.onLine) {
        throw new Error("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      }
      
      // Simulasi scan QR (akan diintegrasikan dengan scanner sesungguhnya nanti)
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard/orangtua");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi kesalahan saat memindai QR Code");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-center space-y-2">
        <p className="text-gray-600">
          Untuk memantau aktivitas dan perkembangan belajar anak Anda, scan QR Code yang dibagikan oleh anak Anda.
        </p>
      </div>

      <Button
        onClick={handleQrScan}
        className="w-full flex items-center justify-center"
        disabled={isLoading}
      >
        <QrCode className="mr-2" size={18} />
        {isLoading ? "Memindai QR Code..." : "Scan QR Code Siswa"}
      </Button>

      {showQrScanner && (
        <div className="mt-4 p-8 border border-gray-200 rounded-md bg-gray-50 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-300 rounded-md mb-4"></div>
            <p className="text-sm text-gray-600">Memindai QR Code...</p>
            <p className="text-xs text-gray-500 mt-1">(Fitur QR Scanner akan diimplementasikan nanti)</p>
          </div>
        </div>
      )}
    </div>
  );
}
