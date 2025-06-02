
import { useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ExamGuardProps {
  children: ReactNode;
  isActive?: boolean;
}

export function ExamGuard({ children, isActive = false }: ExamGuardProps) {
  useEffect(() => {
    if (!isActive) return;

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
      toast.error("Right-click tidak diizinkan selama kuis!");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.altKey && e.key === "Tab") ||
        (e.ctrlKey && e.key === "Tab")
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
  }, [isActive]);

  return <>{children}</>;
}
