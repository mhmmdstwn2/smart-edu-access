
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { kuisFormSchema, KuisFormValues } from "../schemas/kuisFormSchema";

export function useKuisForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const isEditing = !!id;
  const initialKelasId = location.state?.kelasId;

  const form = useForm<KuisFormValues>({
    resolver: zodResolver(kuisFormSchema),
    defaultValues: {
      title: "",
      description: "",
      kelas_id: initialKelasId || "",
      time_limit: null,
      shuffle_questions: false,
      is_published: false,
    },
  });

  const fetchKelasList = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("kelas")
        .select("id, name, subject")
        .eq("guru_id", userId)
        .order("name");

      if (error) throw error;
      setKelasList(data || []);
    } catch (error: any) {
      toast.error("Error mengambil daftar kelas: " + error.message);
    }
  };

  const fetchKuis = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("kuis")
        .select("*")
        .eq("id", id)
        .eq("guru_id", userId)
        .single();

      if (error) throw error;
      if (data) {
        form.reset({
          title: data.title,
          description: data.description || "",
          kelas_id: data.kelas_id,
          time_limit: data.time_limit || null,
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

  const onSubmit = async (values: KuisFormValues, userId: string) => {
    if (!userId) {
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
        guru_id: userId,
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

  return {
    form,
    isLoading,
    isSubmitting,
    isEditing,
    kelasList,
    fetchKelasList,
    fetchKuis,
    onSubmit,
  };
}
