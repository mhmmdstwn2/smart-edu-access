
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RegisterGuru } from "./RegisterGuru";

const RegisterPage = () => {
  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Link to="/" className="absolute top-4 left-4 inline-flex items-center text-primary hover:underline">
          <ChevronLeft className="mr-1" size={20} />
          Kembali ke Beranda
        </Link>

        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Daftar Akun Guru</CardTitle>
            <CardDescription>
              Buat akun guru baru untuk mulai menggunakan MPAA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterGuru />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
