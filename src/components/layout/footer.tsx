
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white font-bold text-xl p-2 rounded">MPAA</div>
              <span className="font-bold text-lg">Media Pembelajaran dan Asesmen Akademik</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Solusi digital untuk pembelajaran dan evaluasi akademik dengan sistem berbasis kuis yang efektif.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Tautan</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary">Beranda</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-primary">Tentang</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-primary">Fitur</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Kontak</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Login</h3>
            <ul className="space-y-2">
              <li><Link to="/login/guru" className="text-gray-600 hover:text-primary">Guru</Link></li>
              <li><Link to="/login/siswa" className="text-gray-600 hover:text-primary">Siswa</Link></li>
              <li><Link to="/login/orangtua" className="text-gray-600 hover:text-primary">Orang Tua</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {currentYear} MPAA (Media Pembelajaran dan Asesmen Akademik). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
