
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Search, BookOpen, Users, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function KelasList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchKelas();
    }
  }, [user]);

  const fetchKelas = async () => {
    try {
      const { data, error } = await supabase
        .from("kelas")
        .select("*")
        .eq("guru_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKelasList(data || []);
    } catch (error: any) {
      toast.error("Error mengambil data kelas: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      try {
        const { error } = await supabase.from("kelas").delete().eq("id", id);
        if (error) throw error;
        toast.success("Kelas berhasil dihapus");
        fetchKelas();
      } catch (error: any) {
        toast.error("Error menghapus kelas: " + error.message);
      }
    }
  };

  const filteredKelas = kelasList.filter(
    (kelas) =>
      kelas.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kelas.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Daftar Kelas</h1>
            <Button onClick={() => navigate("/dashboard/guru/kelas/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Kelas Baru
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Cari kelas berdasarkan nama atau mata pelajaran..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredKelas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? "Tidak ada kelas yang sesuai dengan pencarian Anda."
                  : "Anda belum memiliki kelas. Buat kelas pertama Anda sekarang!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredKelas.map((kelas) => (
                <Card key={kelas.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/dashboard/guru/kelas/${kelas.id}`}>
                    <CardHeader className="bg-primary/10 pb-2">
                      <CardTitle className="line-clamp-1">{kelas.name}</CardTitle>
                    </CardHeader>
                  </Link>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Mata Pelajaran: {kelas.subject}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="mr-1 h-3.5 w-3.5" />
                        <span>Kode Kelas: {kelas.code}</span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/guru/kelas/${kelas.id}`}>
                            <BookOpen className="mr-1 h-4 w-4" /> Detail
                          </Link>
                        </Button>
                        <div className="space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/dashboard/guru/kelas/${kelas.id}/edit`);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(kelas.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
