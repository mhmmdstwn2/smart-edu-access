
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { KuisFormValues } from "../schemas/kuisFormSchema";

interface KuisSettingsFormProps {
  form: UseFormReturn<KuisFormValues>;
}

export function KuisSettingsForm({ form }: KuisSettingsFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="time_limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Batas Waktu (menit)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Contoh: 30"
                value={field.value === null ? '' : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? null : Number(value));
                }}
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
    </>
  );
}
