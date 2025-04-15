
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKuisForm } from "./hooks/useKuisForm";
import { KuisBasicInfoForm } from "./components/KuisBasicInfoForm";
import { KuisSettingsForm } from "./components/KuisSettingsForm";

export default function KuisForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    form,
    isLoading,
    isSubmitting,
    isEditing,
    kelasList,
    fetchKelasList,
    fetchKuis,
    onSubmit
  } = useKuisForm();

  useEffect(() => {
    if (user) {
      fetchKelasList(user.id);
      
      if (isEditing) {
        fetchKuis(user.id);
      }
    }
  }, [user, isEditing]);

  const handleSubmit = (values: any) => {
    if (user) {
      onSubmit(values, user.id);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/guru/kuis")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Kuis" : "Buat Kuis Baru"}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-w-3xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Dasar</CardTitle>
                      <CardDescription>
                        Informasi umum tentang kuis ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <KuisBasicInfoForm form={form} kelasList={kelasList} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pengaturan Kuis</CardTitle>
                      <CardDescription>
                        Konfigurasi bagaimana kuis ini akan berjalan
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <KuisSettingsForm form={form} />
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard/guru/kuis")}
                    >
                      Batal
                    </Button>
                    <div className="space-x-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Kuis" : "Buat Kuis"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
