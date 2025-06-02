
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, FileText, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function KuisList() {
  const { kelasId } = useParams<{ kelasId: string }>();
  const [kuisList, setKuisList] = useState<any[]>([]);
  const [kelas, setKelas] = useState<any>(null);
  const [kuisResults, setKuisResults] = useState<any[]>([]);
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

      // Fetch published quizzes for this class
      const { data: kuisData, error: kuisError } = await supabase
        .from("kuis")
        .select("*")
        .eq("kelas_id", kelasId)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (kuisError) throw kuisError;
      setKuisList(kuisData || []);

      // Fetch student's quiz results
      const { data: resultsData, error: resultsError } = await supabase
        .from("kuis_hasil")
        .select("*")
        .eq("siswa_id", user?.id)
        .in("kuis_id", kuisData?.map(k => k.id) || []);

      if (resultsError) throw resultsError;
      setKuisResults(resultsData || []);

    } catch (error: any) {
      toast.error("Error mengambil data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuizStatus = (kuisId: string) => {
    const result = kuisResults.find(r => r.kuis_id === kuisId);
    return result ? "completed" : "available";
  };

  const getQuizScore = (kuisId: string) => {
    const result = kuisResults.find(r => r.kuis_id === kuisId);
    return result?.score || 0;
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
            <h1 className="text-2xl font-bold">Kuis - {kelas?.name}</h1>
            <p className="text-gray-500">{kelas?.subject}</p>
          </div>
        </div>

        {kuisList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada kuis</h3>
              <p className="text-gray-500">Guru belum memberikan kuis untuk kelas ini</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kuisList.map((kuis) => {
              const status = getQuizStatus(kuis.id);
              const score = getQuizScore(kuis.id);
              
              return (
                <Card key={kuis.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{kuis.title}</CardTitle>
                        <CardDescription>
                          {kuis.description || "Tidak ada deskripsi"}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={status === "completed" ? "default" : "secondary"}
                        className={status === "completed" ? "bg-green-500" : ""}
                      >
                        {status === "completed" ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Selesai
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            Tersedia
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Waktu:</span>
                        <span>
                          {kuis.time_limit ? `${kuis.time_limit} menit` : "Tidak terbatas"}
                        </span>
                      </div>
                      
                      {status === "completed" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Nilai:</span>
                          <span className="font-medium">{score}/100</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        {kuis.shuffle_questions && (
                          <span className="flex items-center">
                            <XCircle className="mr-1 h-3 w-3" />
                            Soal diacak
                          </span>
                        )}
                      </div>

                      <div className="pt-2">
                        {status === "completed" ? (
                          <Button variant="outline" className="w-full" disabled>
                            Sudah Dikerjakan
                          </Button>
                        ) : (
                          <Button asChild className="w-full">
                            <Link to={`/dashboard/siswa/kuis/${kuis.id}/kerjakan`}>
                              Kerjakan Kuis
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
