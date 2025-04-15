
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Clock, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardSiswa = () => {
  // Data dummy untuk dashboard siswa
  const stats = [
    { title: "Kelas Diikuti", value: "3", icon: <BookOpen className="text-primary" size={24} /> },
    { title: "Kuis Diselesaikan", value: "8", icon: <FileText className="text-secondary" size={24} /> },
    { title: "Kuis Menunggu", value: "2", icon: <Clock className="text-warning" size={24} /> },
  ];

  // Data dummy kuis mendatang
  const upcomingQuizzes = [
    { id: "1", title: "Ulangan Harian Persamaan Kuadrat", class: "Matematika", deadline: "Besok, 14:00" },
    { id: "2", title: "Quiz Kinematika Gerak", class: "Fisika", deadline: "3 hari lagi" },
  ];

  // Data dummy materi terbaru
  const recentMaterials = [
    { id: "1", title: "Persamaan Kuadrat", class: "Matematika", type: "PDF" },
    { id: "2", title: "Pengantar Kinetika", class: "Fisika", type: "Video" },
    { id: "3", title: "Genetika Mendel", class: "Biologi", type: "Text" },
  ];

  return (
    <DashboardLayout role="siswa" userName="Andi Wijaya">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="p-2 rounded-full bg-gray-50">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Kuis Mendatang */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kuis Mendatang</CardTitle>
                <CardDescription>Kuis yang harus diselesaikan segera</CardDescription>
              </div>
              <Bell className="text-warning" size={18} />
            </div>
          </CardHeader>
          <CardContent>
            {upcomingQuizzes.length === 0 ? (
              <p className="text-center py-6 text-gray-500">Tidak ada kuis mendatang saat ini</p>
            ) : (
              <div className="space-y-4">
                {upcomingQuizzes.map((quiz) => (
                  <div key={quiz.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-gray-500">{quiz.class}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-warning text-sm font-medium">
                          <Clock className="inline mr-1" size={14} />
                          {quiz.deadline}
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/dashboard/siswa/kuis/${quiz.id}`}>Kerjakan</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gabung Kelas */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Gabung Kelas Baru</CardTitle>
            <CardDescription>Gabung kelas menggunakan kode atau QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg text-center space-y-3">
                <h4 className="font-medium">Punya kode kelas dari guru?</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button asChild>
                    <Link to="/dashboard/siswa/join-class">Input Kode Kelas</Link>
                  </Button>
                  <Button variant="outline">
                    Scan QR Code
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materi Terbaru */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Materi Terbaru</CardTitle>
              <CardDescription>Materi pembelajaran terbaru dari kelas Anda</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/siswa/materi">Lihat Semua</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((material) => (
              <Card key={material.id} className="bg-gray-50 border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{material.title}</h4>
                      <p className="text-sm text-gray-500">{material.class}</p>
                      <div className="mt-2">
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                          {material.type}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/dashboard/siswa/materi/${material.id}`}>Buka</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardSiswa;
