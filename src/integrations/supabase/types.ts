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
      jawaban_siswa: {
        Row: {
          answer_text: string | null
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean | null
          points_awarded: number | null
          soal_id: string
        }
        Insert: {
          answer_text?: string | null
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          points_awarded?: number | null
          soal_id: string
        }
        Update: {
          answer_text?: string | null
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          points_awarded?: number | null
          soal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jawaban_siswa_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "kuis_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jawaban_siswa_soal_id_fkey"
            columns: ["soal_id"]
            isOneToOne: false
            referencedRelation: "soal_kuis"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas: {
        Row: {
          code: string
          created_at: string
          description: string | null
          guru_id: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          guru_id: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          guru_id?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      kelas_siswa: {
        Row: {
          id: string
          joined_at: string
          kelas_id: string
          siswa_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          kelas_id: string
          siswa_id: string
        }
        Update: {
          id?: string
          joined_at?: string
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
          created_at: string
          description: string | null
          guru_id: string
          id: string
          is_published: boolean | null
          kelas_id: string
          shuffle_questions: boolean | null
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          guru_id: string
          id?: string
          is_published?: boolean | null
          kelas_id: string
          shuffle_questions?: boolean | null
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          guru_id?: string
          id?: string
          is_published?: boolean | null
          kelas_id?: string
          shuffle_questions?: boolean | null
          time_limit?: number | null
          title?: string
          updated_at?: string
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
      kuis_attempts: {
        Row: {
          completed_at: string | null
          id: string
          kuis_id: string
          max_score: number | null
          score: number | null
          siswa_id: string
          started_at: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          kuis_id: string
          max_score?: number | null
          score?: number | null
          siswa_id: string
          started_at?: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          kuis_id?: string
          max_score?: number | null
          score?: number | null
          siswa_id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kuis_attempts_kuis_id_fkey"
            columns: ["kuis_id"]
            isOneToOne: false
            referencedRelation: "kuis"
            referencedColumns: ["id"]
          },
        ]
      }
      materi: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          file_url: string | null
          guru_id: string
          id: string
          kelas_id: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          guru_id: string
          id?: string
          kelas_id: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          guru_id?: string
          id?: string
          kelas_id?: string
          title?: string
          updated_at?: string
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
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          school: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          school?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_used: boolean | null
          orangtua_id: string | null
          siswa_id: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          orangtua_id?: string | null
          siswa_id: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          orangtua_id?: string | null
          siswa_id?: string
          token?: string
        }
        Relationships: []
      }
      siswa_tracking: {
        Row: {
          accuracy: number | null
          id: string
          latitude: number | null
          longitude: number | null
          siswa_id: string
          timestamp: string
        }
        Insert: {
          accuracy?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          siswa_id: string
          timestamp?: string
        }
        Update: {
          accuracy?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          siswa_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      soal_kuis: {
        Row: {
          correct_answer: string | null
          id: string
          kuis_id: string
          options: Json | null
          order_num: number
          points: number
          question_text: string
          question_type: string
        }
        Insert: {
          correct_answer?: string | null
          id?: string
          kuis_id: string
          options?: Json | null
          order_num: number
          points?: number
          question_text: string
          question_type: string
        }
        Update: {
          correct_answer?: string | null
          id?: string
          kuis_id?: string
          options?: Json | null
          order_num?: number
          points?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "soal_kuis_kuis_id_fkey"
            columns: ["kuis_id"]
            isOneToOne: false
            referencedRelation: "kuis"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "guru" | "siswa" | "orangtua"
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
    Enums: {
      user_role: ["guru", "siswa", "orangtua"],
    },
  },
} as const
