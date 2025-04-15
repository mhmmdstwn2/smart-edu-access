
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white font-bold text-xl p-2 rounded">MPAA</div>
            <span className="font-bold text-lg hidden md:block">Media Pembelajaran dan Asesmen Akademik</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Beranda</Link>
            <Link to="/about" className="nav-link">Tentang</Link>
            <Link to="/features" className="nav-link">Fitur</Link>
            <Link to="/contact" className="nav-link">Kontak</Link>
            <Button asChild>
              <Link to="/login">Masuk</Link>
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden flex flex-col space-y-4 pt-4 pb-2 animate-fade-in">
            <Link to="/" className="nav-link py-2" onClick={() => setIsOpen(false)}>Beranda</Link>
            <Link to="/about" className="nav-link py-2" onClick={() => setIsOpen(false)}>Tentang</Link>
            <Link to="/features" className="nav-link py-2" onClick={() => setIsOpen(false)}>Fitur</Link>
            <Link to="/contact" className="nav-link py-2" onClick={() => setIsOpen(false)}>Kontak</Link>
            <Button asChild className="mt-2">
              <Link to="/login" onClick={() => setIsOpen(false)}>Masuk</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
