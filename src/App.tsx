
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import DashboardGuru from "./pages/dashboard/guru/DashboardGuru";
import DashboardSiswa from "./pages/dashboard/siswa/DashboardSiswa";
import DashboardOrangtua from "./pages/dashboard/orangtua/DashboardOrangtua";
import KelasList from "./pages/dashboard/guru/kelas/KelasList";
import KelasDetail from "./pages/dashboard/guru/kelas/KelasDetail";
import KelasForm from "./pages/dashboard/guru/kelas/KelasForm";
import MateriList from "./pages/dashboard/guru/materi/MateriList";
import MateriDetail from "./pages/dashboard/guru/materi/MateriDetail";
import MateriForm from "./pages/dashboard/guru/materi/MateriForm";
import KuisList from "./pages/dashboard/guru/kuis/KuisList";
import KuisDetail from "./pages/dashboard/guru/kuis/KuisDetail";
import KuisForm from "./pages/dashboard/guru/kuis/KuisForm";
import AnalisisGuru from "./pages/dashboard/guru/analisis/AnalisisGuru";
import PengaturanGuru from "./pages/dashboard/guru/pengaturan/PengaturanGuru";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/register/:role" element={<RegisterPage />} />
            
            {/* Guru Dashboard Routes */}
            <Route path="/dashboard/guru" element={<DashboardGuru />} />
            <Route path="/dashboard/guru/kelas" element={<KelasList />} />
            <Route path="/dashboard/guru/kelas/new" element={<KelasForm />} />
            <Route path="/dashboard/guru/kelas/:id" element={<KelasDetail />} />
            <Route path="/dashboard/guru/kelas/:id/edit" element={<KelasForm />} />
            <Route path="/dashboard/guru/materi" element={<MateriList />} />
            <Route path="/dashboard/guru/materi/new" element={<MateriForm />} />
            <Route path="/dashboard/guru/materi/:id" element={<MateriDetail />} />
            <Route path="/dashboard/guru/materi/:id/edit" element={<MateriForm />} />
            <Route path="/dashboard/guru/kuis" element={<KuisList />} />
            <Route path="/dashboard/guru/kuis/new" element={<KuisForm />} />
            <Route path="/dashboard/guru/kuis/:id" element={<KuisDetail />} />
            <Route path="/dashboard/guru/kuis/:id/edit" element={<KuisForm />} />
            <Route path="/dashboard/guru/analisis" element={<AnalisisGuru />} />
            <Route path="/dashboard/guru/pengaturan" element={<PengaturanGuru />} />
            
            {/* Siswa and Orangtua Dashboard Routes */}
            <Route path="/dashboard/siswa" element={<DashboardSiswa />} />
            <Route path="/dashboard/orangtua" element={<DashboardOrangtua />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
