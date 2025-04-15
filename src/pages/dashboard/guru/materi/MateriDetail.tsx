
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
  Video,
  FileText,
  BookOpen,
  AlertCircle,
  ExternalLink,
  School,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";

export default function MateriDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materi, setMateri] = useState<any>(null);
  const [kelas, setKelas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchMateri();
    }
  }, [id, user]);

  const fetchMateri = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("materi")
        .select("*")
        .eq("id", id)
        .eq("guru_id", user?.id)
        .single();

      if (error) throw error;
      setMateri(data);

      // Fetch class data
      if (data?.kelas_id) {
        const { data: kelasData, error: kelasError } = await supabase
          .from("kelas")
          .select("*")
          .eq("id", data.kelas_id)
          .single();

        if (kelasError) throw kelasError;
        setKelas(kelasData);
      }
    } catch (error: any) {
      toast.error("Error mengambil data materi: " + error.message);
      navigate("/dashboard/guru/materi");
    } finally {
      setIsLoading(false);
    }
  };

  const getMateriTypeIcon = () => {
    if (materi?.video_url) return <Video className="h-5 w-5 text-red-500" />;
    if (materi?.file_url) return <FileText className="h-5 w-5 text-blue-500" />;
    return <BookOpen className="h-5 w-5 text-green-500" />;
  };

  const getMateriTypeLabel = () => {
    if (materi?.video_url) return "Video";
    if (materi?.file_url) return "File";
    return "Teks";
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

  if (!materi) {
    return (
      <DashboardLayout role="guru">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Materi tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Materi yang Anda cari tidak ditemukan atau Anda tidak memiliki akses
          </p>
          <Button onClick={() => navigate("/dashboard/guru/materi")}>
            Kembali ke Daftar Materi
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
                onClick={() => navigate("/dashboard/guru/materi")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{materi.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center">
                    {getMateriTypeIcon()}
                    <span className="ml-1">{getMateriTypeLabel()}</span>
                  </Badge>
                  {kelas && (
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">
                        {kelas.name}
                      </span>{" "}
                      - {kelas.subject}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={() => navigate(`/dashboard/guru/materi/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Materi
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Kelas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <School className="h-5 w-5 text-primary" />
                <div>
                  {kelas ? (
                    <div>
                      <div className="font-medium">{kelas.name}</div>
                      <div className="text-xs text-gray-500">{kelas.subject}</div>
                    </div>
                  ) : (
                    "Kelas tidak tersedia"
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Tanggal Dibuat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  {new Date(materi.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Terakhir Diperbarui
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  {new Date(materi.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {materi.description && (
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{materi.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Konten Materi</CardTitle>
              <CardDescription>
                {materi.video_url
                  ? "Video pembelajaran"
                  : materi.file_url
                  ? "File pembelajaran"
                  : "Materi pembelajaran dalam bentuk teks"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {materi.content && (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{materi.content}</pre>
                </div>
              )}

              {materi.video_url && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">
                    Materi pembelajaran ini berupa video yang dapat diakses melalui tautan berikut:
                  </p>
                  
                  <div className="mt-2">
                    <Button variant="outline" asChild className="flex items-center">
                      <a
                        href={materi.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Buka Video
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>

                  {/* Try to embed if it's YouTube */}
                  {materi.video_url.includes("youtube.com") && (
                    <div className="aspect-video mt-4">
                      <iframe
                        className="w-full h-full rounded-md"
                        src={materi.video_url.replace("watch?v=", "embed/")}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              )}

              {materi.file_url && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">
                    Materi pembelajaran ini berupa file yang dapat diakses melalui tautan berikut:
                  </p>
                  
                  <div className="mt-2">
                    <Button variant="outline" asChild className="flex items-center">
                      <a
                        href={materi.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Buka File
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {!materi.content && !materi.video_url && !materi.file_url && (
                <p className="text-center text-gray-500 py-4">
                  Tidak ada konten untuk materi ini
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/guru/materi")}
            >
              Kembali ke Daftar Materi
            </Button>
            {kelas && (
              <Button
                variant="outline"
                asChild
              >
                <Link to={`/dashboard/guru/kelas/${kelas.id}`}>
                  Kembali ke Kelas {kelas.name}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
