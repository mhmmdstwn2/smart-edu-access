
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(1, "Nama kelas harus diisi"),
  subject: z.string().min(1, "Mata pelajaran harus diisi"),
  description: z.string().optional(),
  code: z.string().min(5, "Kode kelas minimal 5 karakter"),
});

export default function KelasForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      description: "",
      code: "",
    },
  });

  // Generate a random class code
  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  useEffect(() => {
    // If not editing, generate a random code
    if (!isEditing) {
      form.setValue("code", generateRandomCode());
    }
    
    // If editing, fetch the existing class data
    if (isEditing && user) {
      fetchKelas();
    }
  }, [isEditing, user]);

  const fetchKelas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("kelas")
        .select("*")
        .eq("id", id)
        .eq("guru_id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        form.reset({
          name: data.name,
          subject: data.subject,
          description: data.description || "",
          code: data.code,
        });
      }
    } catch (error: any) {
      toast.error("Error mengambil data kelas: " + error.message);
      navigate("/dashboard/guru/kelas");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Update existing class
        const { error } = await supabase
          .from("kelas")
          .update({
            name: values.name,
            subject: values.subject,
            description: values.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Kelas berhasil diperbarui");
      } else {
        // Create new class
        const { error } = await supabase.from("kelas").insert({
          name: values.name,
          subject: values.subject,
          description: values.description,
          code: values.code,
          guru_id: user.id,
        });

        if (error) throw error;
        toast.success("Kelas baru berhasil dibuat");
      }

      navigate("/dashboard/guru/kelas");
    } catch (error: any) {
      toast.error(
        `Error ${isEditing ? "memperbarui" : "membuat"} kelas: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/guru/kelas")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Kelas" : "Buat Kelas Baru"}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-w-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kelas</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Kelas 10 IPA A" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nama kelas yang akan ditampilkan kepada siswa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mata Pelajaran</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Matematika" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Kelas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Deskripsikan kelas ini secara singkat..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Deskripsi kelas akan ditampilkan kepada siswa (opsional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Kelas</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={isEditing}
                            placeholder="Contoh: ABC123" 
                          />
                        </FormControl>
                        <FormDescription>
                          {isEditing 
                            ? "Kode kelas tidak dapat diubah setelah dibuat" 
                            : "Siswa akan menggunakan kode ini untuk bergabung ke kelas"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard/guru/kelas")}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Kelas" : "Buat Kelas"}
                    </Button>
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
