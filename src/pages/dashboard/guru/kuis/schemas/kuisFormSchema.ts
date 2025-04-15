
import { z } from "zod";

export const kuisFormSchema = z.object({
  title: z.string().min(1, "Judul kuis harus diisi"),
  description: z.string().optional(),
  kelas_id: z.string().min(1, "Pilih kelas untuk kuis ini"),
  time_limit: z.coerce.number().min(1, "Waktu minimum adalah 1 menit").max(180, "Waktu maksimum adalah 180 menit").nullable(),
  shuffle_questions: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

export type KuisFormValues = z.infer<typeof kuisFormSchema>;
