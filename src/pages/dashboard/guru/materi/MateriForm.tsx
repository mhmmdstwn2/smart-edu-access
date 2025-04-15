
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
import { useForm, Controller } from "react-hook-form";
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
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(1, "Judul materi harus diisi"),
  description: z.string().optional(),
  kelas_id: z.string().min(1, "Pilih kelas untuk materi ini"),
  content_type: z.enum(["text", "video", "file"]),
  content: z.string().optional(),
  video_url: z.string().url("Format URL tidak valid").optional(),
  file_url: z.string().optional(),
});

export default function MateriForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const isEditing = !!id;
  const initialKelasId = location.state?.kelasId;
  const initialKelasName = location.state?.kelasName;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      kelas_id: initialKelasId || "",
      content_type: "text",
      content: "",
      video_url: "",
      file_url: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchKelasList();
      
      if (isEditing) {
        fetchMateri();
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

  const fetchMateri = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("materi")
        .select("*")
        .eq("id", id)
        .eq("guru_id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        // Determine content type
        let contentType = "text";
        if (data.video_url) contentType = "video";
        else if (data.file_url) contentType = "file";
        
        form.reset({
          title: data.title,
          description: data.description || "",
          kelas_id: data.kelas_id,
          content_type: contentType as "text" | "video" | "file",
          content: data.content || "",
          video_url: data.video_url || "",
          file_url: data.file_url || "",
        });
      }
    } catch (error: any) {
      toast.error("Error mengambil data materi: " + error.message);
      navigate("/dashboard/guru/materi");
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
      const materiData: any = {
        title: values.title,
        description: values.description,
        kelas_id: values.kelas_id,
        guru_id: user.id,
      };

      // Set content based on selected type
      if (values.content_type === "text") {
        materiData.content = values.content;
        materiData.video_url = null;
        materiData.file_url = null;
      } else if (values.content_type === "video") {
        materiData.content = null;
        materiData.video_url = values.video_url;
        materiData.file_url = null;
      } else if (values.content_type === "file") {
        materiData.content = null;
        materiData.video_url = null;
        materiData.file_url = values.file_url;
      }

      if (isEditing) {
        // Update existing material
        const { error } = await supabase
          .from("materi")
          .update({
            ...materiData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Materi berhasil diperbarui");
      } else {
        // Create new material
        const { error } = await supabase.from("materi").insert(materiData);

        if (error) throw error;
        toast.success("Materi baru berhasil dibuat");
      }

      navigate("/dashboard/guru/materi");
    } catch (error: any) {
      toast.error(
        `Error ${isEditing ? "memperbarui" : "membuat"} materi: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentType = form.watch("content_type");

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/guru/materi")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Materi" : "Buat Materi Baru"}
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
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul Materi</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Pengenalan Aljabar" {...field} />
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
                          {initialKelasName && (
                            <FormDescription>
                              Materi ini dibuat untuk kelas {initialKelasName}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Materi</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Deskripsikan materi pembelajaran ini secara singkat..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Jenis Konten</FormLabel>
                    <FormField
                      control={form.control}
                      name="content_type"
                      render={({ field }) => (
                        <FormItem>
                          <Tabs
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                          >
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="text">Teks</TabsTrigger>
                              <TabsTrigger value="video">Video</TabsTrigger>
                              <TabsTrigger value="file">File</TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="mt-4">
                              <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Konten Teks</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Tuliskan konten materi di sini..."
                                        className="min-h-[200px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Tuliskan materi pembelajaran dalam format teks
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TabsContent>
                            <TabsContent value="video" className="mt-4">
                              <FormField
                                control={form.control}
                                name="video_url"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>URL Video</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Masukkan URL video dari Youtube, Vimeo, atau platform lainnya
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TabsContent>
                            <TabsContent value="file" className="mt-4">
                              <FormField
                                control={form.control}
                                name="file_url"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>URL File</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://drive.google.com/file/..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Masukkan URL file (PDF, dokumen, dll) dari Google Drive, Dropbox, atau platform lainnya
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TabsContent>
                          </Tabs>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard/guru/materi")}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Materi" : "Buat Materi"}
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
