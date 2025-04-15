
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MapPin, Clock } from "lucide-react";

const DashboardOrangtua = () => {
  // Data dummy untuk dashboard orang tua
  const childData = {
    name: "Budi Pratama",
    school: "SMA Budi Utomo",
    class: "Kelas 10 IPA",
    lastActive: "Hari ini, 14:30",
    location: "Sekitar sekolah (500m)",
    quizzes: [
      { subject: "Matematika", title: "Ulangan Fungsi", score: 85, date: "10 April 2025" },
      { subject: "Fisika", title: "Quiz Kinematika", score: 90, date: "8 April 2025" },
      { subject: "Biologi", title: "Latihan Genetika", score: 75, date: "5 April 2025" },
    ]
  };

  // Data dummy untuk aktivitas
  const activities = [
    { type: "login", time: "Hari ini, 08:15", description: "Login ke aplikasi" },
    { type: "quiz", time: "Hari ini, 09:30", description: "Mengerjakan kuis Matematika" },
    { type: "material", time: "Hari ini, 10:45", description: "Membaca materi Fisika" },
    { type: "quiz", time: "Kemarin, 13:20", description: "Mengerjakan kuis Biologi" },
  ];

  return (
    <DashboardLayout role="orangtua" userName="Ahmad Santoso">
      {/* Header Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Informasi Anak</h2>
            <p className="text-gray-600">Pantau perkembangan belajar dan aktivitas anak Anda</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center bg-primary-light text-primary px-4 py-2 rounded-full">
              <MapPin className="mr-2" size={18} />
              <span className="font-medium">{childData.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-500 text-sm">Nama</p>
            <p className="font-medium">{childData.name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-500 text-sm">Sekolah</p>
            <p className="font-medium">{childData.school}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-500 text-sm">Kelas</p>
            <p className="font-medium">{childData.class}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nilai Terbaru */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Nilai Terbaru</CardTitle>
              <CardDescription>Hasil kuis dan ujian terbaru</CardDescription>
            </div>
            <BarChart3 className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {childData.quizzes.map((quiz, i) => (
                <div key={i} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-gray-500">{quiz.subject} • {quiz.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-medium ${
                      quiz.score >= 85 ? "bg-success-light text-success" :
                      quiz.score >= 70 ? "bg-warning-light text-warning" :
                      "bg-danger-light text-danger"
                    }`}>
                      {quiz.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aktivitas Terbaru */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Aktivitas belajar anak Anda</CardDescription>
            </div>
            <Clock className="text-secondary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6">
              {activities.map((activity, i) => (
                <div key={i} className="relative pb-6">
                  {/* Vertical timeline line */}
                  {i < activities.length - 1 && (
                    <div className="absolute top-2 left-[-24px] bottom-0 w-[2px] bg-gray-200"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute top-2 left-[-28px] w-[10px] h-[10px] rounded-full bg-secondary"></div>
                  
                  <div>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <p className="font-medium">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peta Lokasi (Placeholder) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Lokasi Terkini</CardTitle>
          <CardDescription>
            Memantau lokasi anak Anda (diperbarui setiap 15 menit)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 h-[300px] flex items-center justify-center rounded-md">
            <p className="text-gray-500">
              Peta lokasi akan ditampilkan di sini menggunakan Google Maps API
            </p>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <p className="text-gray-500">
              <Clock className="inline mr-1" size={14} />
              Terakhir diperbarui: {childData.lastActive}
            </p>
            <p className="text-primary font-medium">
              <MapPin className="inline mr-1" size={14} />
              {childData.location}
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardOrangtua;
