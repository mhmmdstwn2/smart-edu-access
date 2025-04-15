
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users, PlusCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardGuru = () => {
  // Data dummy untuk dashboard
  const stats = [
    { title: "Total Kelas", value: "5", icon: <Users className="text-primary" size={24} /> },
    { title: "Total Kuis", value: "12", icon: <FileText className="text-secondary" size={24} /> },
    { title: "Total Materi", value: "24", icon: <BookOpen className="text-success" size={24} /> },
    { title: "Siswa Aktif", value: "78", icon: <BarChart3 className="text-warning" size={24} /> },
  ];

  // Data dummy kelas terbaru
  const recentClasses = [
    { id: "1", name: "Matematika Kelas 10", subject: "Matematika", students: 25, code: "MATH10" },
    { id: "2", name: "Fisika Kelas 11", subject: "Fisika", students: 22, code: "PHYS11" },
    { id: "3", name: "Biologi Kelas 12", subject: "Biologi", students: 18, code: "BIO12" },
  ];

  // Data dummy kuis terbaru
  const recentQuizzes = [
    { id: "1", title: "Ulangan Harian Fungsi", class: "Matematika Kelas 10", submissions: 20, maxScore: 100 },
    { id: "2", title: "Quiz Kinematika", class: "Fisika Kelas 11", submissions: 15, maxScore: 100 },
    { id: "3", title: "Latihan Genetika", class: "Biologi Kelas 12", submissions: 10, maxScore: 100 },
  ];

  return (
    <DashboardLayout role="guru" userName="Budi Santoso">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Tombol Aksi Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Button asChild className="bg-primary h-auto py-3" size="lg">
          <Link to="/dashboard/guru/kelas/buat" className="flex items-center justify-center">
            <PlusCircle size={18} className="mr-2" />
            Buat Kelas Baru
          </Link>
        </Button>
        
        <Button asChild className="bg-secondary h-auto py-3" size="lg">
          <Link to="/dashboard/guru/kuis/buat" className="flex items-center justify-center">
            <PlusCircle size={18} className="mr-2" />
            Buat Kuis Baru
          </Link>
        </Button>
        
        <Button asChild className="bg-success h-auto py-3" size="lg">
          <Link to="/dashboard/guru/materi/buat" className="flex items-center justify-center">
            <PlusCircle size={18} className="mr-2" />
            Unggah Materi Baru
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kelas Terbaru */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Kelas Terbaru</CardTitle>
              <CardDescription>Kelas yang Anda kelola</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/guru/kelas">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-4">
              {recentClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.subject} • {cls.students} siswa</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">
                      Kode: {cls.code}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/guru/kelas/buat">Tambah Kelas Baru</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Kuis Terbaru */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Kuis Terbaru</CardTitle>
              <CardDescription>Kuis yang Anda buat</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/guru/kuis">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{quiz.title}</p>
                    <p className="text-sm text-gray-500">{quiz.class}</p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="text-green-600 font-medium">{quiz.submissions}</span> / {quiz.maxScore} nilai
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/guru/kuis/buat">Buat Kuis Baru</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardGuru;
