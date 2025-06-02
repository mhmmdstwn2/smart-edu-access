export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      absensi: {
        Row: {
          created_at: string | null
          date: string
          id: string
          kelas_id: string
          siswa_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          kelas_id: string
          siswa_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          kelas_id?: string
          siswa_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "absensi_kelas_id_fkey"
            columns: ["kelas_id"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          guru_id: string
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          guru_id: string
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          guru_id?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kelas_siswa: {
        Row: {
          id: string
          joined_at: string | null
          kelas_id: string
          siswa_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          kelas_id: string
          siswa_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          kelas_id?: string
          siswa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kelas_siswa_kelas_id_fkey"
            columns: ["kelas_id"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
        ]
      }
      kuis: {
        Row: {
          created_at: string | null
          description: string | null
          guru_id: string
          id: string
          is_published: boolean | null
          kelas_id: string | null
          shuffle_questions: boolean | null
          time_limit: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          guru_id: string
          id?: string
          is_published?: boolean | null
          kelas_id?: string | null
          shuffle_questions?: boolean | null
          time_limit?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          guru_id?: string
          id?: string
          is_published?: boolean | null
          kelas_id?: string | null
          shuffle_questions?: boolean | null
          time_limit?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kuis_kelas_id_fkey"
            columns: ["kelas_id"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
        ]
      }
      kuis_hasil: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          kuis_id: string
          score: number
          siswa_id: string
          started_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          kuis_id: string
          score: number
          siswa_id: string
          started_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          kuis_id?: string
          score?: number
          siswa_id?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kuis_hasil_kuis_id_fkey"
            columns: ["kuis_id"]
            isOneToOne: false
            referencedRelation: "kuis"
            referencedColumns: ["id"]
          },
        ]
      }
      kuis_jawaban: {
        Row: {
          answer: string | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          kuis_id: string
          pertanyaan_id: string
          siswa_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          kuis_id: string
          pertanyaan_id: string
          siswa_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          kuis_id?: string
          pertanyaan_id?: string
          siswa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kuis_jawaban_kuis_id_fkey"
            columns: ["kuis_id"]
            isOneToOne: false
            referencedRelation: "kuis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kuis_jawaban_pertanyaan_id_fkey"
            columns: ["pertanyaan_id"]
            isOneToOne: false
            referencedRelation: "kuis_pertanyaan"
            referencedColumns: ["id"]
          },
        ]
      }
      kuis_media: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          media_type: string
          mime_type: string | null
          pertanyaan_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          media_type: string
          mime_type?: string | null
          pertanyaan_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          media_type?: string
          mime_type?: string | null
          pertanyaan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kuis_media_pertanyaan_id_fkey"
            columns: ["pertanyaan_id"]
            isOneToOne: false
            referencedRelation: "kuis_pertanyaan"
            referencedColumns: ["id"]
          },
        ]
      }
      kuis_pertanyaan: {
        Row: {
          additional_data: Json | null
          audio_url: string | null
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          image_url: string | null
          kuis_id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          points: number | null
          question: string
          template_id: string | null
          video_url: string | null
        }
        Insert: {
          additional_data?: Json | null
          audio_url?: string | null
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          kuis_id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          points?: number | null
          question: string
          template_id?: string | null
          video_url?: string | null
        }
        Update: {
          additional_data?: Json | null
          audio_url?: string | null
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          kuis_id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          points?: number | null
          question?: string
          template_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kuis_pertanyaan_kuis_id_fkey"
            columns: ["kuis_id"]
            isOneToOne: false
            referencedRelation: "kuis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kuis_pertanyaan_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "kuis_template"
            referencedColumns: ["id"]
          },
        ]
      }
      kuis_template: {
        Row: {
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      materi: {
        Row: {
          content: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          guru_id: string
          id: string
          kelas_id: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          guru_id: string
          id?: string
          kelas_id?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          guru_id?: string
          id?: string
          kelas_id?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materi_kelas_id_fkey"
            columns: ["kelas_id"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          role: string
          school: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name: string
          role?: string
          school?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          school?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
