
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
  BookOpen,
  FileText,
  Video,
  Edit,
  Trash2,
  Clock,
  School
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";

export default function MateriList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [materiList, setMateriList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [kelasMap, setKelasMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user) {
      fetchKelas();
      fetchMateri();
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

  const fetchMateri = async () => {
    try {
      const { data, error } = await supabase
        .from("materi")
        .select("*")
        .eq("guru_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMateriList(data || []);
    } catch (error: any) {
      toast.error("Error mengambil data materi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
      try {
        const { error } = await supabase.from("materi").delete().eq("id", id);
        if (error) throw error;
        toast.success("Materi berhasil dihapus");
        fetchMateri();
      } catch (error: any) {
        toast.error("Error menghapus materi: " + error.message);
      }
    }
  };

  const getMateriTypeIcon = (materi: any) => {
    if (materi.video_url) return <Video className="h-4 w-4 text-red-500" />;
    if (materi.file_url) return <FileText className="h-4 w-4 text-blue-500" />;
    return <BookOpen className="h-4 w-4 text-green-500" />;
  };

  const getMateriTypeLabel = (materi: any) => {
    if (materi.video_url) return "Video";
    if (materi.file_url) return "File";
    return "Teks";
  };

  const filteredMateri = materiList.filter(
    (materi) =>
      materi.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kelasMap[materi.kelas_id]?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Daftar Materi Pembelajaran</h1>
            <Button onClick={() => navigate("/dashboard/guru/materi/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Materi Baru
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Cari materi berdasarkan judul atau kelas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMateri.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? "Tidak ada materi yang sesuai dengan pencarian Anda."
                  : "Anda belum memiliki materi pembelajaran. Buat materi pertama Anda sekarang!"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate("/dashboard/guru/materi/new")}
                  variant="outline"
                  className="mt-4"
                >
                  Tambah Materi Sekarang
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMateri.map((materi) => (
                <Card key={materi.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/dashboard/guru/materi/${materi.id}`}>
                    <CardHeader className="bg-primary/10 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1">{materi.title}</CardTitle>
                        <Badge variant="outline" className="flex items-center">
                          {getMateriTypeIcon(materi)}
                          <span className="ml-1">{getMateriTypeLabel(materi)}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                  </Link>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <School className="mr-1 h-3.5 w-3.5" />
                        <span className="line-clamp-1">Kelas: {kelasMap[materi.kelas_id]?.name || "Loading..."}</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        <span>
                          {new Date(materi.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {materi.description && (
                        <p className="text-sm line-clamp-2">{materi.description}</p>
                      )}
                      
                      <div className="flex justify-between mt-4 pt-2 border-t">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/guru/materi/${materi.id}`}>
                            <BookOpen className="mr-1 h-4 w-4" /> Detail
                          </Link>
                        </Button>
                        <div className="space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/dashboard/guru/materi/${materi.id}/edit`);
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
                              handleDelete(materi.id);
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
