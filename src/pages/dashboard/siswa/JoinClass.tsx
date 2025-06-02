
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, QrCode } from "lucide-react";

export default function JoinClass() {
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      toast.error("Masukkan kode kelas");
      return;
    }

    if (!user) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      // Check if class exists
      const { data: kelas, error: kelasError } = await supabase
        .from("kelas")
        .select("*")
        .eq("code", classCode.trim())
        .single();

      if (kelasError) {
        toast.error("Kode kelas tidak ditemukan");
        return;
      }

      // Check if student already joined
      const { data: existing, error: existingError } = await supabase
        .from("kelas_siswa")
        .select("*")
        .eq("kelas_id", kelas.id)
        .eq("siswa_id", user.id)
        .single();

      if (existing) {
        toast.error("Anda sudah bergabung dengan kelas ini");
        navigate("/dashboard/siswa/kelas");
        return;
      }

      // Join the class
      const { error: joinError } = await supabase
        .from("kelas_siswa")
        .insert({
          kelas_id: kelas.id,
          siswa_id: user.id,
        });

      if (joinError) throw joinError;

      toast.success(`Berhasil bergabung dengan kelas ${kelas.name}`);
      navigate("/dashboard/siswa/kelas");
    } catch (error: any) {
      toast.error("Error bergabung kelas: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="siswa">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Gabung Kelas</CardTitle>
            <CardDescription>
              Masukkan kode kelas yang diberikan oleh guru untuk bergabung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="classCode">Kode Kelas</Label>
              <Input
                id="classCode"
                placeholder="Contoh: ABC123"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && handleJoinClass()}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleJoinClass} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bergabung...
                  </>
                ) : (
                  "Gabung Kelas"
                )}
              </Button>
              <Button variant="outline" className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
