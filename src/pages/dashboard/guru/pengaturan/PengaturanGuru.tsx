
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().optional(),
  school: z.string().optional(),
  avatar_url: z.string().optional(),
});

export default function PengaturanGuru() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      school: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Get user data
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      setProfileData(profileData);
      
      // Set form values
      form.reset({
        name: profileData?.name || "",
        email: userData.user?.email || "",
        school: profileData?.school || "",
        avatar_url: profileData?.avatar_url || "",
      });
      
    } catch (error: any) {
      toast.error("Error mengambil data profil: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: values.name,
          school: values.school,
          avatar_url: values.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Profil berhasil diperbarui");
      
      // Refresh profile data
      fetchProfileData();
    } catch (error: any) {
      toast.error("Error memperbarui profil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <ProtectedRoute>
      <DashboardLayout role="guru">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Pengaturan Akun</h1>
            <p className="text-gray-500 mt-1">
              Kelola informasi profil dan preferensi akun Anda
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
              <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage 
                          src={profileData?.avatar_url || ""} 
                          alt={profileData?.name || "Avatar"} 
                        />
                        <AvatarFallback className="text-lg">
                          {getInitials(profileData?.name || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="font-medium text-lg">{profileData?.name}</h3>
                        <p className="text-sm text-gray-500">Guru</p>
                      </div>
                    </div>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nama Lengkap</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nama lengkap Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Email Anda" 
                                    {...field} 
                                    disabled 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Email tidak dapat diubah
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="school"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sekolah</FormLabel>
                              <FormControl>
                                <Input placeholder="Nama sekolah Anda" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="avatar_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL Avatar</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/avatar.jpg" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Masukkan URL gambar untuk avatar Anda
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Keamanan</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <h3 className="text-lg font-medium mb-2">
                    Pengaturan Keamanan Akan Segera Hadir
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Anda akan dapat mengubah password dan mengaktifkan autentikasi dua faktor
                    untuk meningkatkan keamanan akun Anda.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifikasi</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <h3 className="text-lg font-medium mb-2">
                    Pengaturan Notifikasi Akan Segera Hadir
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Anda akan dapat menyesuaikan preferensi notifikasi untuk aktifitas kelas,
                    pengumpulan tugas, dan informasi penting lainnya.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
