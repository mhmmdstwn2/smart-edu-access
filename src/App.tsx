
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import DashboardGuru from "./pages/dashboard/guru/DashboardGuru";
import DashboardSiswa from "./pages/dashboard/siswa/DashboardSiswa";
import DashboardOrangtua from "./pages/dashboard/orangtua/DashboardOrangtua";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/register/:role" element={<RegisterPage />} />
          <Route path="/dashboard/guru" element={<DashboardGuru />} />
          <Route path="/dashboard/siswa" element={<DashboardSiswa />} />
          <Route path="/dashboard/orangtua" element={<DashboardOrangtua />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
