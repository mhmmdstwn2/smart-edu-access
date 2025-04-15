
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BarChart, AreaChart } from "lucide-react";

export default function AnalisisGuru() {
  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Analisis Pembelajaran</h1>
            <p className="text-gray-500 mt-1">
              Pantau kemajuan dan performa kelas Anda
            </p>
          </div>

          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Analisis dan Statistik
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <AreaChart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Fitur Analisis Akan Segera Hadir
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Anda akan dapat melihat statistik performa siswa, tingkat penyelesaian kuis, 
                dan analisis mendalam tentang kemajuan pembelajaran di kelas Anda.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
