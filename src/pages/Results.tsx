import { useSearchParams, Link } from 'react-router-dom';
import { Home, RotateCcw, TrendingUp } from 'lucide-react';

export default function Results() {
  const [params] = useSearchParams();
  const correct = parseInt(params.get('correct') ?? '0');
  const total = parseInt(params.get('total') ?? '1');
  const duration = parseInt(params.get('duration') ?? '0');
  const mode = params.get('mode') ?? 'mixto';

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const grade =
    pct >= 90
      ? { emoji: '🏆', label: 'Excelente', color: 'text-yellow-500' }
      : pct >= 70
        ? { emoji: '🌟', label: 'Muy bien', color: 'text-blue-500' }
        : pct >= 50
          ? { emoji: '👍', label: 'Bien', color: 'text-green-500' }
          : { emoji: '📚', label: 'Sigue practicando', color: 'text-orange-500' };

  // Circle progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-8 py-8 pb-20 sm:pb-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Sesión completada</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Modo: <span className="font-medium capitalize">{mode}</span>
        </p>
      </div>

      {/* Circle */}
      <div className="relative">
        <svg width="160" height="160" className="-rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-1000 ${
              pct >= 70 ? 'stroke-green-500' : pct >= 50 ? 'stroke-yellow-500' : 'stroke-red-500'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{pct}%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">aciertos</span>
        </div>
      </div>

      <div className={`text-center ${grade.color}`}>
        <div className="text-5xl mb-2">{grade.emoji}</div>
        <p className="text-xl font-bold">{grade.label}</p>
      </div>

      {/* Stats */}
      <div className="w-full max-w-sm grid grid-cols-3 gap-3">
        <ResultStat value={`${correct}/${total}`} label="Correctas" color="text-green-600 dark:text-green-400" />
        <ResultStat value={`${total - correct}`} label="Errores" color="text-red-500 dark:text-red-400" />
        <ResultStat
          value={minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
          label="Tiempo"
          color="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Link
          to="/practicar"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <RotateCcw size={16} />
          Nueva sesión
        </Link>
        <Link
          to="/estadisticas"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium text-sm transition-colors"
        >
          <TrendingUp size={16} />
          Ver estadísticas
        </Link>
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
        >
          <Home size={16} />
          Inicio
        </Link>
      </div>
    </div>
  );
}

function ResultStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
