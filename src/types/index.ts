
// Definisi tipe data utama untuk aplikasi MPAA

// Tipe User
export type UserRole = 'guru' | 'siswa' | 'orangtua';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  photoUrl?: string;
  school?: string;
}

// Tipe Kelas
export interface Class {
  id: string;
  name: string;
  teacherId: string;
  classCode: string;
  subject?: string;
  description?: string;
  createdAt: Date;
}

// Tipe Kuis
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  classId: string;
  duration?: number; // dalam menit
  shuffleQuestions: boolean;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
}

// Tipe Soal Kuis
export type QuestionType = 'pilihan_ganda' | 'uraian';

export interface Question {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  options?: string[]; // Untuk pilihan ganda
  correctAnswer?: string | number; // Jawaban benar untuk pilihan ganda
  points: number;
  order: number;
}

// Tipe Materi
export type MaterialType = 'pdf' | 'video' | 'text';

export interface Material {
  id: string;
  classId: string;
  title: string;
  description?: string;
  type: MaterialType;
  content: string; // URL untuk PDF/video atau konten teks
  createdAt: Date;
}

// Tipe Nilai
export interface Score {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  submittedAt: Date;
  duration?: number; // durasi pengerjaan dalam detik
}

// Tipe QR Code
export interface QRCode {
  id: string;
  studentId: string;
  parentId?: string;
  classId?: string;
  code: string;
  expiresAt?: Date;
}

// Tipe Tracking Lokasi
export interface LocationTracking {
  id: string;
  studentId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  isActive: boolean;
}
