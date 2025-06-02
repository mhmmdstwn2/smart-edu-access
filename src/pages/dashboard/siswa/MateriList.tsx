
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookOpen, FileText, Video, Download, ArrowLeft } from "lucide-react";

export default function MateriList() {
  const { kelasId } = useParams<{ kelasId: string }>();
  const [materiList, setMateriList] = useState<any[]>([]);
  const [kelas, setKelas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && kelasId) {
      fetchData();
    }
  }, [user, kelasId]);

  const fetchData = async () => {
    try {
      // Fetch class info
      const { data: kelasData, error: kelasError } = await supabase
        .from("kelas")
        .select("*")
        .eq("id", kelasId)
        .single();

      if (kelasError) throw kelasError;
      setKelas(kelasData);

      // Fetch materials for this class
      const { data: materiData, error: materiError } = await supabase
        .from("materi")
        .select("*")
        .eq("kelas_id", kelasId)
        .order("created_at", { ascending: false });

      if (materiError) throw materiError;
      setMateriList(materiData || []);

    } catch (error: any) {
      toast.error("Error mengambil data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMateriIcon = (materi: any) => {
    if (materi.video_url) return <Video className="h-5 w-5 text-red-500" />;
    if (materi.file_url) return <Download className="h-5 w-5 text-blue-500" />;
    return <FileText className="h-5 w-5 text-green-500" />;
  };

  const getMateriType = (materi: any) => {
    if (materi.video_url) return "Video";
    if (materi.file_url) return "File";
    return "Teks";
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/dashboard/siswa/kelas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Materi - {kelas?.name}</h1>
            <p className="text-gray-500">{kelas?.subject}</p>
          </div>
        </div>

        {materiList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada materi</h3>
              <p className="text-gray-500">Guru belum menambahkan materi untuk kelas ini</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {materiList.map((materi) => (
              <Card key={materi.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getMateriIcon(materi)}
                        <CardTitle className="text-lg">{materi.title}</CardTitle>
                        <Badge variant="outline">{getMateriType(materi)}</Badge>
                      </div>
                      <CardDescription>
                        {materi.description || "Tidak ada deskripsi"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {materi.content && (
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: materi.content }} />
                      </div>
                    )}

                    {materi.video_url && (
                      <div className="aspect-video">
                        <iframe
                          src={materi.video_url}
                          className="w-full h-full rounded-lg border"
                          allowFullScreen
                          title={materi.title}
                        />
                      </div>
                    )}

                    {materi.file_url && (
                      <div className="flex justify-start">
                        <Button asChild variant="outline">
                          <a 
                            href={materi.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download File
                          </a>
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Dipublikasi pada: {new Date(materi.created_at).toLocaleDateString("id-ID")}
                    </div>
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
