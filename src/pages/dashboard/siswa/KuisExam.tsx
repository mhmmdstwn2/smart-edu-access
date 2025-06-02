
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, AlertTriangle, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function KuisExam() {
  const { kuisId } = useParams<{ kuisId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [kuis, setKuis] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Prevent tab switching and browser navigation
  useEffect(() => {
    if (!examStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Jangan berpindah tab selama mengerjakan kuis!");
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Apakah Anda yakin ingin meninggalkan halaman? Jawaban akan hilang.";
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.shiftKey && e.key === "C")
      ) {
        e.preventDefault();
        toast.error("Shortcut tidak diizinkan selama kuis!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [examStarted]);

  useEffect(() => {
    if (user && kuisId) {
      fetchKuisData();
    }
  }, [user, kuisId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const fetchKuisData = async () => {
    try {
      // Check if already completed
      const { data: existingResult, error: resultError } = await supabase
        .from("kuis_hasil")
        .select("*")
        .eq("kuis_id", kuisId)
        .eq("siswa_id", user?.id)
        .single();

      if (existingResult) {
        toast.error("Anda sudah mengerjakan kuis ini");
        navigate("/dashboard/siswa");
        return;
      }

      // Fetch quiz info
      const { data: kuisData, error: kuisError } = await supabase
        .from("kuis")
        .select("*")
        .eq("id", kuisId)
        .eq("is_published", true)
        .single();

      if (kuisError) throw kuisError;
      setKuis(kuisData);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("kuis_pertanyaan")
        .select("*")
        .eq("kuis_id", kuisId)
        .order("created_at");

      if (questionsError) throw questionsError;
      
      const shuffledQuestions = kuisData.shuffle_questions 
        ? questionsData.sort(() => Math.random() - 0.5)
        : questionsData;
      
      setQuestions(shuffledQuestions);

      if (kuisData.time_limit) {
        setTimeLeft(kuisData.time_limit * 60); // Convert to seconds
      }

    } catch (error: any) {
      toast.error("Error mengambil data kuis: " + error.message);
      navigate("/dashboard/siswa");
    } finally {
      setIsLoading(false);
    }
  };

  const startExam = async () => {
    startTimeRef.current = new Date();
    setExamStarted(true);

    // Start timer if time limit exists
    if (timeLeft !== null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) return 0;
          return prev - 1;
        });
      }, 1000);
    }

    // Record start time
    try {
      await supabase.from("kuis_hasil").insert({
        kuis_id: kuisId,
        siswa_id: user?.id,
        score: 0,
        started_at: startTimeRef.current.toISOString(),
      });
    } catch (error) {
      console.error("Error recording start time:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const completedAt = new Date();

      // Update quiz result
      const { error: updateError } = await supabase
        .from("kuis_hasil")
        .update({
          score,
          completed_at: completedAt.toISOString(),
        })
        .eq("kuis_id", kuisId)
        .eq("siswa_id", user?.id);

      if (updateError) throw updateError;

      // Save individual answers
      const answerPromises = questions.map(question => {
        return supabase.from("kuis_jawaban").insert({
          kuis_id: kuisId,
          pertanyaan_id: question.id,
          siswa_id: user?.id,
          answer: answers[question.id] || "",
          is_correct: answers[question.id] === question.correct_answer,
        });
      });

      await Promise.all(answerPromises);

      toast.success(`Kuis selesai! Nilai Anda: ${score}/100`);
      navigate("/dashboard/siswa");
    } catch (error: any) {
      toast.error("Error menyimpan hasil: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <DashboardLayout role="siswa">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!examStarted) {
    return (
      <DashboardLayout role="siswa">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{kuis?.title}</CardTitle>
              <CardDescription>{kuis?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-sm text-gray-500">Jumlah Soal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {kuis?.time_limit ? `${kuis.time_limit} menit` : "∞"}
                  </div>
                  <div className="text-sm text-gray-500">Waktu</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800 mb-1">Perhatian:</div>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Jangan berpindah tab atau meninggalkan halaman</li>
                      <li>• Kuis akan otomatis terkirim jika waktu habis</li>
                      <li>• Jawaban tidak dapat diubah setelah submit</li>
                      <li>• Right-click dan shortcut keyboard dinonaktifkan</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={startExam} className="w-full" size="lg">
                Mulai Kuis
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <DashboardLayout role="siswa">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer and progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">{kuis?.title}</h1>
            {timeLeft !== null && (
              <div className={`flex items-center space-x-2 ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Soal {currentQuestion + 1} dari {questions.length}</span>
              <span>{answeredCount} terjawab</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Soal {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentQ?.image_url && (
              <img
                src={currentQ.image_url}
                alt="Gambar soal"
                className="w-full max-w-md mx-auto mb-4 rounded-lg border"
              />
            )}
            
            <p className="text-lg mb-6">{currentQ?.question}</p>

            <RadioGroup
              value={answers[currentQ?.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQ?.id, value)}
            >
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer flex-1 p-3 rounded-lg hover:bg-gray-50">
                    {option}. {currentQ?.[`option_${option.toLowerCase()}`]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
          >
            Sebelumnya
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestion ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className={answers[questions[index]?.id] ? "bg-green-100 border-green-300" : ""}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button onClick={() => setShowSubmitDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Selesai
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={currentQuestion === questions.length - 1}
            >
              Selanjutnya
            </Button>
          )}
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Selesaikan Kuis?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda telah menjawab {answeredCount} dari {questions.length} soal.
                Setelah submit, Anda tidak dapat mengubah jawaban lagi.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitQuiz} disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Submit"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
