
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  Search,
  FileText,
  Edit,
  Trash2,
  Clock,
  School,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";

export default function KuisList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kuisList, setKuisList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [kelasMap, setKelasMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user) {
      fetchKelas();
      fetchKuis();
    }
  }, [user]);

  const fetchKelas = async () => {
    try {
      const { data, error } = await supabase
        .from("kelas")
        .select("id, name")
        .eq("guru_id", user?.id);

      if (error) throw error;
      
      const kelasMapping: Record<string, any> = {};
      if (data) {
        data.forEach(kelas => {
          kelasMapping[kelas.id] = kelas;
        });
      }
      setKelasMap(kelasMapping);
    } catch (error: any) {
      toast.error("Error mengambil data kelas: " + error.message);
    }
  };

  const fetchKuis = async () => {
    try {
      const { data, error } = await supabase
        .from("kuis")
        .select("*")
        .eq("guru_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKuisList(data || []);
    } catch (error: any) {
      toast.error("Error mengambil data kuis: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kuis ini?")) {
      try {
        const { error } = await supabase.from("kuis").delete().eq("id", id);
        if (error) throw error;
        toast.success("Kuis berhasil dihapus");
        fetchKuis();
      } catch (error: any) {
        toast.error("Error menghapus kuis: " + error.message);
      }
    }
  };

  const filteredKuis = kuisList.filter(
    (kuis) =>
      kuis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kelasMap[kuis.kelas_id]?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Daftar Kuis</h1>
            <Button onClick={() => navigate("/dashboard/guru/kuis/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Kuis Baru
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Cari kuis berdasarkan judul atau kelas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredKuis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? "Tidak ada kuis yang sesuai dengan pencarian Anda."
                  : "Anda belum memiliki kuis. Buat kuis pertama Anda sekarang!"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate("/dashboard/guru/kuis/new")}
                  variant="outline"
                  className="mt-4"
                >
                  Tambah Kuis Sekarang
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredKuis.map((kuis) => (
                <Card key={kuis.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/dashboard/guru/kuis/${kuis.id}`}>
                    <CardHeader className="bg-primary/10 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1">{kuis.title}</CardTitle>
                        <Badge 
                          variant={kuis.is_published ? "default" : "outline"}
                          className={kuis.is_published ? "bg-green-500" : ""}
                        >
                          {kuis.is_published ? "Publikasi" : "Draft"}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Link>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <School className="mr-1 h-3.5 w-3.5" />
                        <span className="line-clamp-1">Kelas: {kelasMap[kuis.kelas_id]?.name || "Loading..."}</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        <span>
                          {kuis.time_limit 
                            ? `Waktu: ${kuis.time_limit} menit` 
                            : "Tanpa batas waktu"}
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        {kuis.shuffle_questions ? (
                          <CheckCircle className="mr-1 h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircle className="mr-1 h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span>
                          {kuis.shuffle_questions 
                            ? "Soal diacak" 
                            : "Soal tidak diacak"}
                        </span>
                      </div>

                      {kuis.description && (
                        <p className="text-sm line-clamp-2 mt-2">{kuis.description}</p>
                      )}
                      
                      <div className="flex justify-between mt-4 pt-2 border-t">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/guru/kuis/${kuis.id}`}>
                            <FileText className="mr-1 h-4 w-4" /> Detail
                          </Link>
                        </Button>
                        <div className="space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/dashboard/guru/kuis/${kuis.id}/edit`);
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
                              handleDelete(kuis.id);
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
