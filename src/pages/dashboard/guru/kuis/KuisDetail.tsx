
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Clock,
  AlertCircle,
  School,
  FileText,
  Shuffle,
  PlusCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function KuisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kuis, setKuis] = useState<any>(null);
  const [kelas, setKelas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [soalCount, setSoalCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    if (user && id) {
      fetchKuisData();
    }
  }, [id, user]);

  const fetchKuisData = async () => {
    setIsLoading(true);
    try {
      // Fetch quiz details
      const { data: kuisData, error: kuisError } = await supabase
        .from("kuis")
        .select("*")
        .eq("id", id)
        .eq("guru_id", user?.id)
        .single();

      if (kuisError) throw kuisError;
      setKuis(kuisData);

      // Fetch class data
      if (kuisData?.kelas_id) {
        const { data: kelasData, error: kelasError } = await supabase
          .from("kelas")
          .select("*")
          .eq("id", kuisData.kelas_id)
          .single();

        if (kelasError) throw kelasError;
        setKelas(kelasData);
      }

      // Fetch counts in parallel
      const [soalResult, attemptResult] = await Promise.all([
        // Count questions
        supabase
          .from("soal_kuis")
          .select("*", { count: "exact", head: true })
          .eq("kuis_id", id),
        
        // Count attempts
        supabase
          .from("kuis_attempts")
          .select("*", { count: "exact", head: true })
          .eq("kuis_id", id),
      ]);

      setSoalCount(soalResult.count || 0);
      setAttemptCount(attemptResult.count || 0);
      
    } catch (error: any) {
      toast.error("Error mengambil data kuis: " + error.message);
      navigate("/dashboard/guru/kuis");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const { error } = await supabase
        .from("kuis")
        .update({
          is_published: !kuis.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success(
        kuis.is_published
          ? "Kuis telah dibuat menjadi draft"
          : "Kuis telah dipublikasikan"
      );
      
      // Update local state
      setKuis({
        ...kuis,
        is_published: !kuis.is_published,
      });
    } catch (error: any) {
      toast.error("Error mengubah status kuis: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="guru">
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!kuis) {
    return (
      <DashboardLayout role="guru">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Kuis tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Kuis yang Anda cari tidak ditemukan atau Anda tidak memiliki akses
          </p>
          <Button onClick={() => navigate("/dashboard/guru/kuis")}>
            Kembali ke Daftar Kuis
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard/guru/kuis")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{kuis.title}</h1>
                  <Badge 
                    variant={kuis.is_published ? "default" : "outline"}
                    className={kuis.is_published ? "bg-green-500" : ""}
                  >
                    {kuis.is_published ? "Publikasi" : "Draft"}
                  </Badge>
                </div>
                {kelas && (
                  <p className="text-gray-500">
                    Kelas: <span className="font-medium">{kelas.name}</span> - {kelas.subject}
                  </p>
                )}
              </div>
            </div>
            <div className="space-x-2">
              <Button
                variant={kuis.is_published ? "outline" : "default"}
                onClick={handlePublishToggle}
              >
                {kuis.is_published ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Jadikan Draft
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publikasikan
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate(`/dashboard/guru/kuis/${id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Kuis
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Jumlah Soal
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{soalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Batas Waktu
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <div className="text-2xl font-bold">
                  {kuis.time_limit ? `${kuis.time_limit} menit` : "Tidak Ada"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Percobaan Siswa
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <School className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold">
                  {attemptCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informasi Kuis</CardTitle>
                <Badge 
                  variant="outline" 
                  className="flex items-center"
                >
                  <Shuffle className="mr-1 h-3 w-3" />
                  {kuis.shuffle_questions ? "Soal Diacak" : "Soal Tidak Diacak"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                  <p className="mt-1">
                    {kuis.description || "Tidak ada deskripsi untuk kuis ini."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dibuat pada</h3>
                    <p className="mt-1">
                      {new Date(kuis.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Terakhir diperbarui</h3>
                    <p className="mt-1">
                      {new Date(kuis.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="soal" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="soal" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Daftar Soal
              </TabsTrigger>
              <TabsTrigger value="hasil" className="flex items-center">
                <School className="mr-2 h-4 w-4" />
                Hasil Siswa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="soal" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Daftar Soal</h2>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Soal
                </Button>
              </div>

              {soalCount === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500 mb-4">
                      Belum ada soal yang ditambahkan ke kuis ini
                    </p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tambah Soal Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500 mb-4">
                      Fitur pengelolaan soal akan segera hadir
                    </p>
                    <p className="text-sm text-gray-500">
                      Anda akan dapat menambahkan, mengubah, dan menghapus soal kuis di sini.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hasil" className="space-y-4">
              <h2 className="text-xl font-semibold">Hasil Siswa</h2>
              
              {attemptCount === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500">
                      Belum ada siswa yang mengerjakan kuis ini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500 mb-4">
                      Fitur hasil kuis siswa akan segera hadir
                    </p>
                    <p className="text-sm text-gray-500">
                      Anda akan dapat melihat hasil kuis siswa di sini.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
