import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="bg-transparent fixed top-0 z-50 w-full">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="px-4 py-2 text-white hover:backdrop-blur-sm hover:bg-white/10 transition rounded font-bold"
        >
          Escursioni
        </Link>

        {/* Menu link */}
        <div className="flex justify-center w-full items-center space-x-6">
          <Link
            href="/"
            className={`px-4 hover:text-indigo-600 py-2 text-white hover:backdrop-blur-sm hover:bg-white/10 transition rounded font-bold ${
              isActive("/") ? "text-indigo-600 bg-amet" : "text-gray-700 "
            }`}
          >
            Home
          </Link>

          <Link
            href="/trails"
            className={`px-4 hover:text-indigo-600 py-2 text-white hover:backdrop-blur-sm hover:bg-white/10 transition rounded font-bold ${
              isActive("/trails") ? "text-indigo-600 bg-amet" : "text-gray-700 "
            }`}
          >
            Sentieri
          </Link>

          <Link
            href="/huts"
            className={`px-4 hover:text-indigo-600 py-2 text-white hover:backdrop-blur-sm hover:bg-white/10 transition rounded font-bold ${
              isActive("/huts") ? "text-indigo-600 bg-amet" : "text-gray-700 "
            }`}
          >
            Rifugi
          </Link>

          {/* Aggiungi qui altri link quando necessario */}
        </div>
      </nav>
    </header>
  );
}
