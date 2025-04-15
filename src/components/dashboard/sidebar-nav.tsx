
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  BarChart
} from "lucide-react";

interface SidebarNavProps {
  role: 'guru' | 'siswa' | 'orangtua';
  className?: string;
}

export function SidebarNav({ role, className }: SidebarNavProps) {
  const location = useLocation();
  
  // Menu items based on user role
  const menuItems = {
    guru: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/guru' },
      { icon: <Users size={20} />, label: 'Kelas', href: '/dashboard/guru/kelas' },
      { icon: <FileText size={20} />, label: 'Kuis', href: '/dashboard/guru/kuis' },
      { icon: <BookOpen size={20} />, label: 'Materi', href: '/dashboard/guru/materi' },
      { icon: <BarChart size={20} />, label: 'Analisis', href: '/dashboard/guru/analisis' },
      { icon: <Settings size={20} />, label: 'Pengaturan', href: '/dashboard/guru/pengaturan' },
    ],
    siswa: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/siswa' },
      { icon: <Users size={20} />, label: 'Kelas Saya', href: '/dashboard/siswa/kelas' },
      { icon: <FileText size={20} />, label: 'Kuis', href: '/dashboard/siswa/kuis' },
      { icon: <BookOpen size={20} />, label: 'Materi Belajar', href: '/dashboard/siswa/materi' },
      { icon: <Settings size={20} />, label: 'Profil', href: '/dashboard/siswa/profil' },
    ],
    orangtua: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/orangtua' },
      { icon: <BarChart size={20} />, label: 'Nilai Anak', href: '/dashboard/orangtua/nilai' },
      { icon: <FileText size={20} />, label: 'Aktivitas', href: '/dashboard/orangtua/aktivitas' },
      { icon: <Users size={20} />, label: 'Lokasi', href: '/dashboard/orangtua/lokasi' },
      { icon: <Settings size={20} />, label: 'Pengaturan', href: '/dashboard/orangtua/pengaturan' },
    ]
  };

  const items = menuItems[role] || [];

  return (
    <nav className={cn("space-y-1", className)}>
      {items.map(item => {
        const isActive = location.pathname === item.href;
        
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive && "bg-secondary/10 text-secondary font-medium"
            )}
          >
            <Link to={item.href} className="flex items-center">
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </Button>
        );
      })}
      
      <div className="pt-4 mt-6 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <Link to="/logout" className="flex items-center">
            <LogOut size={20} className="mr-2" />
            Keluar
          </Link>
        </Button>
      </div>
    </nav>
  );
}
