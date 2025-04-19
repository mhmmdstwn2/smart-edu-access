
import { Layout } from "@/components/layout/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginGuru from "./LoginGuru";
import { LoginSiswa } from "./LoginSiswa";
import { LoginOrangtua } from "./LoginOrangtua";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";

const LoginPage = () => {
  const { role } = useParams();
  const defaultTab = role === "guru" ? "guru" : role === "siswa" ? "siswa" : role === "orangtua" ? "orangtua" : "guru";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white font-bold text-xl p-2 rounded">MPAA</div>
              <span className="font-bold text-lg hidden md:block">Media Pembelajaran dan Asesmen Akademik</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Beranda</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">Tentang</Link>
              <Link to="/features" className="text-gray-600 hover:text-gray-900">Fitur</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Kontak</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Back button and Login Form */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ChevronLeft className="mr-1" size={20} />
          Kembali ke Beranda
        </Link>

        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login MPAA</CardTitle>
              <CardDescription>
                Silakan login sesuai dengan peran Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="guru">Guru</TabsTrigger>
                  <TabsTrigger value="siswa">Siswa</TabsTrigger>
                  <TabsTrigger value="orangtua">Orang Tua</TabsTrigger>
                </TabsList>
                <TabsContent value="guru">
                  <LoginGuru />
                </TabsContent>
                <TabsContent value="siswa">
                  <LoginSiswa />
                </TabsContent>
                <TabsContent value="orangtua">
                  <LoginOrangtua />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
