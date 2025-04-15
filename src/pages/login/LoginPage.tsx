
import { Layout } from "@/components/layout/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginGuru } from "./LoginGuru";
import { LoginSiswa } from "./LoginSiswa";
import { LoginOrangtua } from "./LoginOrangtua";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const LoginPage = () => {
  const { role } = useParams();
  const defaultTab = role === "guru" ? "guru" : role === "siswa" ? "siswa" : role === "orangtua" ? "orangtua" : "guru";

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Link to="/" className="absolute top-4 left-4 inline-flex items-center text-primary hover:underline">
          <ChevronLeft className="mr-1" size={20} />
          Kembali ke Beranda
        </Link>

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
    </Layout>
  );
};

export default LoginPage;
