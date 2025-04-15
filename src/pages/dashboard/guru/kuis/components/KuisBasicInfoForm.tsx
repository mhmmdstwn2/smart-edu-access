
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { KuisFormValues } from "../schemas/kuisFormSchema";

interface KuisBasicInfoFormProps {
  form: UseFormReturn<KuisFormValues>;
  kelasList: any[];
}

export function KuisBasicInfoForm({ form, kelasList }: KuisBasicInfoFormProps) {
  return (
    <>
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
    </>
  );
}
