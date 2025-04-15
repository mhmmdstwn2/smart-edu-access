
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(1, "Judul kuis harus diisi"),
  description: z.string().optional(),
  kelas_id: z.string().min(1, "Pilih kelas untuk kuis ini"),
  time_limit: z.union([
    z.number().min(1, "Waktu minimum adalah 1 menit").max(180, "Waktu maksimum adalah 180 menit"),
    z.literal("")
  ]).transform(val => val === "" ? null : val),
  shuffle_questions: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

export default function KuisForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const isEditing = !!id;
  const initialKelasId = location.state?.kelasId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      kelas_id: initialKelasId || "",
      time_limit: "",
      shuffle_questions: false,
      is_published: false,
    },
  });

  useEffect(() => {
    if (user) {
      fetchKelasList();
      
      if (isEditing) {
        fetchKuis();
      }
    }
  }, [user, isEditing]);

  const fetchKelasList = async () => {
    try {
      const { data, error } = await supabase
        .from("kelas")
        .select("id, name, subject")
        .eq("guru_id", user?.id)
        .order("name");

      if (error) throw error;
      setKelasList(data || []);
    } catch (error: any) {
      toast.error("Error mengambil daftar kelas: " + error.message);
    }
  };

  const fetchKuis = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("kuis")
        .select("*")
        .eq("id", id)
        .eq("guru_id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        form.reset({
          title: data.title,
          description: data.description || "",
          kelas_id: data.kelas_id,
          time_limit: data.time_limit === null ? "" : data.time_limit,
          shuffle_questions: data.shuffle_questions || false,
          is_published: data.is_published || false,
        });
      }
    } catch (error: any) {
      toast.error("Error mengambil data kuis: " + error.message);
      navigate("/dashboard/guru/kuis");
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
      const kuisData = {
        title: values.title,
        description: values.description,
        kelas_id: values.kelas_id,
        time_limit: values.time_limit,
        shuffle_questions: values.shuffle_questions,
        is_published: values.is_published,
        guru_id: user.id,
      };

      if (isEditing) {
        // Update existing quiz
        const { error } = await supabase
          .from("kuis")
          .update({
            ...kuisData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Kuis berhasil diperbarui");
      } else {
        // Create new quiz
        const { error } = await supabase.from("kuis").insert(kuisData);

        if (error) throw error;
        toast.success("Kuis baru berhasil dibuat");
      }

      navigate("/dashboard/guru/kuis");
    } catch (error: any) {
      toast.error(
        `Error ${isEditing ? "memperbarui" : "membuat"} kuis: ${error.message}`
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Dasar</CardTitle>
                      <CardDescription>
                        Informasi umum tentang kuis ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Judul Kuis</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Ulangan Harian Bab 2" {...field} />
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
                            <FormLabel>Deskripsi Kuis</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Deskripsikan kuis ini secara singkat..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kelas_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kelas</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kelas" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {kelasList.map((kelas) => (
                                  <SelectItem key={kelas.id} value={kelas.id}>
                                    {kelas.name} - {kelas.subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      <FormField
                        control={form.control}
                        name="time_limit"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Batas Waktu (menit)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Contoh: 30"
                                {...field}
                                value={value === null ? "" : value}
                                onChange={(e) =>
                                  onChange(
                                    e.target.value === ""
                                      ? ""
                                      : parseInt(e.target.value, 10)
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Kosongkan jika tidak ada batasan waktu
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shuffle_questions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Acak Soal
                              </FormLabel>
                              <FormDescription>
                                Soal akan ditampilkan dalam urutan acak untuk setiap siswa
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Publikasikan Kuis
                              </FormLabel>
                              <FormDescription>
                                Kuis yang dipublikasikan akan terlihat dan dapat dikerjakan oleh siswa
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
