
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookOpen, Users, FileText, Plus } from "lucide-react";

export default function KelasList() {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchKelasList();
    }
  }, [user]);

  const fetchKelasList = async () => {
    try {
      const { data, error } = await supabase
        .from("kelas_siswa")
        .select(`
          *,
          kelas:kelas_id (
            id,
            name,
            subject,
            description,
            code,
            guru_id
          )
        `)
        .eq("siswa_id", user?.id);

      if (error) throw error;
      setKelasList(data || []);
    } catch (error: any) {
      toast.error("Error mengambil daftar kelas: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="siswa">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="siswa">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kelas Saya</h1>
            <p className="text-gray-500">Daftar kelas yang Anda ikuti</p>
          </div>
          <Button asChild>
            <Link to="/dashboard/siswa/join-class">
              <Plus className="mr-2 h-4 w-4" />
              Gabung Kelas
            </Link>
          </Button>
        </div>

        {kelasList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada kelas</h3>
              <p className="text-gray-500 mb-4">
                Anda belum bergabung dengan kelas manapun
              </p>
              <Button asChild>
                <Link to="/dashboard/siswa/join-class">Gabung Kelas Sekarang</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kelasList.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.kelas.name}</CardTitle>
                      <CardDescription>{item.kelas.subject}</CardDescription>
                    </div>
                    <Badge variant="outline">{item.kelas.code}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.kelas.description || "Tidak ada deskripsi"}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/dashboard/siswa/kelas/${item.kelas.id}/kuis`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Kuis
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/dashboard/siswa/kelas/${item.kelas.id}/materi`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Materi
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
