
import { ReactNode, useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { UserRole } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName?: string;
  userAvatar?: string;
}

export function DashboardLayout({
  children,
  role,
  userName = "User",
  userAvatar,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Title based on role
  const dashboardTitle = {
    guru: "Dashboard Guru",
    siswa: "Dashboard Siswa",
    orangtua: "Dashboard Orang Tua",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white font-bold text-lg p-1 rounded">
              MPAA
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-100">
            <Avatar>
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>

          <SidebarNav role={role} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex h-full">
        {/* Desktop sidebar */}
        <div
          className={`hidden lg:block fixed top-0 bottom-0 border-r border-gray-200 bg-white transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div
            className={`flex items-center ${
              sidebarOpen ? "justify-between" : "justify-center"
            } p-4 border-b`}
          >
            {sidebarOpen ? (
              <>
                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-primary text-white font-bold text-lg p-1 rounded">
                    MPAA
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChevronLeft size={18} />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <ChevronRight size={18} />
              </Button>
            )}
          </div>

          <div className={`p-4 ${!sidebarOpen && "items-center"}`}>
            {sidebarOpen && (
              <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-100">
                <Avatar>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              </div>
            )}

            {!sidebarOpen && (
              <div className="flex justify-center pb-4 mb-4 border-b border-gray-100">
                <Avatar>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <SidebarNav
              role={role}
              className={!sidebarOpen ? "items-center" : ""}
            />
          </div>
        </div>

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          {/* Top header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu size={20} />
                </Button>
                <h1 className="text-xl font-bold">{dashboardTitle[role]}</h1>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:block">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{userName}</span>
                    <Avatar>
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback>
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
