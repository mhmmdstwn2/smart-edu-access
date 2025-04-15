
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
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Users,
  BookOpen,
  FileText,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function KelasDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kelas, setKelas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siswaCount, setSiswaCount] = useState(0);
  const [materiCount, setMateriCount] = useState(0);
  const [kuisCount, setKuisCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchKelasData();
    }
  }, [id, user]);

  const fetchKelasData = async () => {
    setIsLoading(true);
    try {
      // Fetch class details
      const { data: kelasData, error: kelasError } = await supabase
        .from("kelas")
        .select("*")
        .eq("id", id)
        .eq("guru_id", user?.id)
        .single();

      if (kelasError) throw kelasError;
      setKelas(kelasData);

      // Fetch counts in parallel
      const [siswaResult, materiResult, kuisResult] = await Promise.all([
        // Count students in this class
        supabase
          .from("kelas_siswa")
          .select("*", { count: "exact", head: true })
          .eq("kelas_id", id),
        
        // Count materials in this class
        supabase
          .from("materi")
          .select("*", { count: "exact", head: true })
          .eq("kelas_id", id),
        
        // Count quizzes in this class
        supabase
          .from("kuis")
          .select("*", { count: "exact", head: true })
          .eq("kelas_id", id)
      ]);

      setSiswaCount(siswaResult.count || 0);
      setMateriCount(materiResult.count || 0);
      setKuisCount(kuisResult.count || 0);
      
    } catch (error: any) {
      toast.error("Error mengambil data kelas: " + error.message);
      navigate("/dashboard/guru/kelas");
    } finally {
      setIsLoading(false);
    }
  };

  const copyKodeKelas = () => {
    if (!kelas?.code) return;
    
    navigator.clipboard.writeText(kelas.code);
    setCopied(true);
    toast.success("Kode kelas disalin ke clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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

  if (!kelas) {
    return (
      <DashboardLayout role="guru">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Kelas tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Kelas yang Anda cari tidak ditemukan atau Anda tidak memiliki akses ke kelas ini
          </p>
          <Button onClick={() => navigate("/dashboard/guru/kelas")}>
            Kembali ke Daftar Kelas
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
                onClick={() => navigate("/dashboard/guru/kelas")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{kelas.name}</h1>
                <p className="text-gray-500">{kelas.subject}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/dashboard/guru/kelas/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Kelas
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Kode Kelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{kelas.code}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyKodeKelas}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Bagikan kode ini ke siswa untuk bergabung ke kelas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Jumlah Siswa
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{siswaCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Konten Kelas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <span>Materi</span>
                  </div>
                  <span className="font-medium">{materiCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <span>Kuis</span>
                  </div>
                  <span className="font-medium">{kuisCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Kelas</CardTitle>
              <CardDescription>
                Deskripsi dan detail kelas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                  <p className="mt-1">
                    {kelas.description || "Tidak ada deskripsi untuk kelas ini."}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dibuat pada</h3>
                  <p className="mt-1">
                    {new Date(kelas.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="materi" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="materi" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Materi
              </TabsTrigger>
              <TabsTrigger value="kuis" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Kuis
              </TabsTrigger>
              <TabsTrigger value="siswa" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Daftar Siswa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materi" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Materi Pembelajaran</h2>
                <Button
                  onClick={() =>
                    navigate("/dashboard/guru/materi/new", {
                      state: { kelasId: id, kelasName: kelas.name },
                    })
                  }
                >
                  Tambah Materi
                </Button>
              </div>

              {materiCount === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500">
                      Belum ada materi yang ditambahkan ke kelas ini
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        navigate("/dashboard/guru/materi/new", {
                          state: { kelasId: id, kelasName: kelas.name },
                        })
                      }
                    >
                      Tambah Materi Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Link to="/dashboard/guru/materi" className="block">
                  <Button variant="outline" className="w-full">
                    Lihat Semua Materi
                  </Button>
                </Link>
              )}
            </TabsContent>

            <TabsContent value="kuis" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Kuis dan Ujian</h2>
                <Button
                  onClick={() =>
                    navigate("/dashboard/guru/kuis/new", {
                      state: { kelasId: id, kelasName: kelas.name },
                    })
                  }
                >
                  Tambah Kuis
                </Button>
              </div>

              {kuisCount === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500">
                      Belum ada kuis yang ditambahkan ke kelas ini
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        navigate("/dashboard/guru/kuis/new", {
                          state: { kelasId: id, kelasName: kelas.name },
                        })
                      }
                    >
                      Tambah Kuis Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Link to="/dashboard/guru/kuis" className="block">
                  <Button variant="outline" className="w-full">
                    Lihat Semua Kuis
                  </Button>
                </Link>
              )}
            </TabsContent>

            <TabsContent value="siswa" className="space-y-4">
              <h2 className="text-xl font-semibold">Daftar Siswa</h2>

              {siswaCount === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500">
                      Belum ada siswa yang bergabung ke kelas ini
                    </p>
                    <p className="mt-2 text-sm">
                      Bagikan kode kelas <strong>{kelas.code}</strong> kepada
                      siswa untuk bergabung
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-500">
                      {siswaCount} siswa telah bergabung ke kelas ini
                    </p>
                    <Button variant="outline" className="mt-4">
                      Lihat Daftar Siswa
                    </Button>
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
