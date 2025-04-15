
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/ui/role-card";
import { Link } from "react-router-dom";
import { BookOpen, Users, UserCheck, Book, Award, Clock, BarChart4, Map } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Media Pembelajaran dan Asesmen Akademik Digital
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Solusi lengkap untuk pembelajaran interaktif, pembuatan kuis, dan pemantauan kemajuan siswa secara real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/login">Mulai Sekarang</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/features">Pelajari Fitur</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Role Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Masuk sebagai</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MPAA dirancang untuk berbagai pengguna dalam ekosistem pendidikan. Pilih peran Anda untuk memulai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <RoleCard
              title="Guru"
              description="Buat kelas, kuis, dan pantau kemajuan siswa Anda secara efektif"
              icon={<Users className="text-primary" />}
              linkTo="/login/guru"
              color="primary"
            />
            <RoleCard
              title="Siswa"
              description="Akses kuis dan materi pembelajaran dengan mudah menggunakan ID kelas atau QR code"
              icon={<BookOpen className="text-secondary" />}
              linkTo="/login/siswa"
              color="secondary"
            />
            <RoleCard
              title="Orang Tua"
              description="Pantau kemajuan belajar dan lokasi anak Anda dengan scan QR code"
              icon={<UserCheck className="text-success" />}
              linkTo="/login/orangtua"
              color="success"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fitur Utama</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MPAA menyediakan berbagai fitur untuk mendukung proses pembelajaran dan evaluasi akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-xl mb-2">Materi Pembelajaran</h3>
              <p className="text-gray-600">Unggah PDF, video YouTube, atau buat ringkasan materi untuk siswa</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-secondary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-secondary" size={24} />
              </div>
              <h3 className="font-bold text-xl mb-2">Kuis Interaktif</h3>
              <p className="text-gray-600">Buat kuis pilihan ganda atau uraian dengan opsi acakan soal</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-success-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart4 className="text-success" size={24} />
              </div>
              <h3 className="font-bold text-xl mb-2">Analisis Hasil</h3>
              <p className="text-gray-600">Pantau hasil belajar dan aktivitas siswa dengan laporan lengkap</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-warning-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="text-warning-dark" size={24} />
              </div>
              <h3 className="font-bold text-xl mb-2">Pelacakan Lokasi</h3>
              <p className="text-gray-600">Orang tua dapat memantau lokasi anak mereka saat menggunakan aplikasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap untuk memulai?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Bergabunglah dengan MPAA sekarang dan tingkatkan pengalaman pembelajaran Anda.
          </p>
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary-dark">
            <Link to="/register/guru">Daftar Sebagai Guru</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
