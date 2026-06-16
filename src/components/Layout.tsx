import { Link, useLocation } from 'react-router-dom';
import { BarChart2, BookOpen, Home, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/practicar', icon: BookOpen, label: 'Practicar' },
    { to: '/estadisticas', icon: BarChart2, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
            <span className="text-2xl">🚀</span>
            <span>ComercialLog</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                pathname === to
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
