
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  BookOpen,
  FileText,
  Users,
  BarChart,
  School,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardGuru() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalKelas: 0,
    totalMateri: 0,
    totalKuis: 0,
    totalSiswa: 0,
  });
  const [recentKelas, setRecentKelas] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
      fetchDashboardData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfileData(data);
    } catch (error: any) {
      console.error("Error fetching profile data:", error.message);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Recent classes
      const { data: kelasData, error: kelasError } = await supabase
        .from("kelas")
        .select("*")
        .eq("guru_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (kelasError) throw kelasError;
      setRecentKelas(kelasData || []);

      // Get counts
      const [kelasCount, materiCount, kuisCount] = await Promise.all([
        supabase
          .from("kelas")
          .select("*", { count: "exact", head: true })
          .eq("guru_id", user?.id),
        supabase
          .from("materi")
          .select("*", { count: "exact", head: true })
          .eq("guru_id", user?.id),
        supabase
          .from("kuis")
          .select("*", { count: "exact", head: true })
          .eq("guru_id", user?.id),
      ]);

      // Count students across all classes
      let totalStudents = 0;
      if (kelasCount.count && kelasCount.count > 0) {
        const { data: kelasIds } = await supabase
          .from("kelas")
          .select("id")
          .eq("guru_id", user?.id);
        
        if (kelasIds && kelasIds.length > 0) {
          const kelasIdList = kelasIds.map(k => k.id);
          
          const { count: studentCount } = await supabase
            .from("kelas_siswa")
            .select("*", { count: "exact", head: true })
            .in("kelas_id", kelasIdList);
          
          totalStudents = studentCount || 0;
        }
      }

      setStats({
        totalKelas: kelasCount.count || 0,
        totalMateri: materiCount.count || 0,
        totalKuis: kuisCount.count || 0,
        totalSiswa: totalStudents,
      });
    } catch (error: any) {
      toast.error("Error mengambil data dashboard: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout 
        role="guru" 
        userName={profileData?.name || "Guru"}
        userAvatar={profileData?.avatar_url}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">
              Selamat Datang, {profileData?.name || "Guru"}!
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola kelas, materi pembelajaran, dan kuis Anda di sini
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Kelas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <School className="h-5 w-5 text-blue-500" />
                      <div className="text-2xl font-bold">{stats.totalKelas}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Siswa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <div className="text-2xl font-bold">{stats.totalSiswa}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Materi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-amber-500" />
                      <div className="text-2xl font-bold">{stats.totalMateri}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Kuis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <div className="text-2xl font-bold">{stats.totalKuis}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Kelas Terbaru</CardTitle>
                      <Link to="/dashboard/guru/kelas">
                        <Button variant="ghost" size="sm">
                          Lihat Semua
                        </Button>
                      </Link>
                    </div>
                    <CardDescription>
                      Kelas yang baru-baru ini Anda buat atau perbarui
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentKelas.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">
                          Anda belum memiliki kelas. Buat kelas pertama Anda sekarang!
                        </p>
                        <Button asChild>
                          <Link to="/dashboard/guru/kelas/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Buat Kelas
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentKelas.map((kelas) => (
                          <div
                            key={kelas.id}
                            className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                          >
                            <div>
                              <h4 className="font-medium">{kelas.name}</h4>
                              <p className="text-sm text-gray-500">
                                {kelas.subject}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="ml-2"
                            >
                              <Link to={`/dashboard/guru/kelas/${kelas.id}`}>
                                Detail
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex justify-between w-full">
                      <Button asChild variant="outline">
                        <Link to="/dashboard/guru/kelas">
                          <School className="mr-2 h-4 w-4" />
                          Kelola Kelas
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/dashboard/guru/kelas/new">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Buat Kelas
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Manajemen Konten</CardTitle>
                    <CardDescription>
                      Kelola materi dan kuis untuk semua kelas Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                        <div>
                          <h4 className="font-medium">Materi Pembelajaran</h4>
                          <p className="text-xs text-gray-500">
                            {stats.totalMateri} materi tersedia
                          </p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/dashboard/guru/materi">Kelola</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to="/dashboard/guru/materi/new">
                            <PlusCircle className="mr-1 h-3 w-3" />
                            Buat
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-amber-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-amber-500" />
                        <div>
                          <h4 className="font-medium">Kuis dan Ujian</h4>
                          <p className="text-xs text-gray-500">
                            {stats.totalKuis} kuis tersedia
                          </p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/dashboard/guru/kuis">Kelola</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to="/dashboard/guru/kuis/new">
                            <PlusCircle className="mr-1 h-3 w-3" />
                            Buat
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/dashboard/guru/analisis">
                        <BarChart className="mr-2 h-4 w-4" />
                        Lihat Analisis Pembelajaran
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
