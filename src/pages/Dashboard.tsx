import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Target, BookOpen, BarChart2, Clock } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import { allContent } from '../data';

export default function Dashboard() {
  const { progress, globalAccuracy } = useProgressContext();

  const accuracy = globalAccuracy();
  const totalAnswered = Object.values(progress.items).reduce(
    (s, v) => s + v.correct + v.incorrect,
    0,
  );
  const totalSessions = progress.sessions.length;
  const lastSession = progress.sessions[0];

  const comercialItems = allContent.filter((i) => i.area === 'comercial').length;
  const logisticaItems = allContent.filter((i) => i.area === 'logistica').length;

  const comercialAnswered = Object.entries(progress.items).filter(([id]) =>
    allContent.find((i) => i.id === id && i.area === 'comercial'),
  ).length;

  const logisticaAnswered = Object.entries(progress.items).filter(([id]) =>
    allContent.find((i) => i.id === id && i.area === 'logistica'),
  ).length;

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">¡Hola de nuevo! 👋</h1>
        <p className="text-blue-100 text-sm">
          Practica conceptos de comercial y logística con ejercicios reales.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat
            icon={<Zap size={18} />}
            value={`${progress.streakDays}d`}
            label="Racha"
            light
          />
          <Stat
            icon={<Target size={18} />}
            value={accuracy !== null ? `${accuracy}%` : '—'}
            label="Aciertos"
            light
          />
          <Stat
            icon={<TrendingUp size={18} />}
            value={totalAnswered.toString()}
            label="Respuestas"
            light
          />
        </div>

        <Link
          to="/practicar"
          className="mt-5 block w-full py-3 bg-white text-blue-700 font-semibold rounded-xl text-center text-sm hover:bg-blue-50 transition-colors"
        >
          Iniciar sesión de práctica
        </Link>
      </div>

      {/* Areas */}
      <div>
        <h2 className="text-base font-semibold mb-3">Áreas de conocimiento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AreaCard
            area="comercial"
            label="Comercial"
            icon="💰"
            color="from-emerald-500 to-teal-600"
            answered={comercialAnswered}
            total={comercialItems}
          />
          <AreaCard
            area="logistica"
            label="Logística"
            icon="🚚"
            color="from-orange-500 to-amber-600"
            answered={logisticaAnswered}
            total={logisticaItems}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold mb-3">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            to="/practicar?mode=quiz"
            icon="❓"
            label="Quiz rápido"
            desc="10 preguntas de opción múltiple"
          />
          <QuickAction
            to="/practicar?mode=ejercicio"
            icon="🔢"
            label="Ejercicios"
            desc="Problemas con resolución"
          />
          <QuickAction
            to="/practicar?mode=flashcard"
            icon="🃏"
            label="Flashcards"
            desc="Repaso con Leitner"
          />
          <QuickAction
            to="/practicar?mode=mixto"
            icon="🎲"
            label="Sesión mixta"
            desc="Combina los tres modos"
          />
        </div>
      </div>

      {/* Stats summary */}
      <div>
        <h2 className="text-base font-semibold mb-3">Resumen de actividad</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<BookOpen size={18} />} value={totalSessions.toString()} label="Sesiones" />
          <StatCard icon={<Target size={18} />} value={accuracy !== null ? `${accuracy}%` : '—'} label="Precisión global" />
          <StatCard icon={<BarChart2 size={18} />} value={totalAnswered.toString()} label="Respuestas totales" />
          <StatCard
            icon={<Clock size={18} />}
            value={
              lastSession
                ? new Date(lastSession.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                : '—'
            }
            label="Última sesión"
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, light }: { icon: React.ReactNode; value: string; label: string; light?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center ${light ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
      <div className={`flex justify-center mb-1 ${light ? 'text-white' : 'text-gray-500'}`}>{icon}</div>
      <p className={`text-xl font-bold ${light ? 'text-white' : ''}`}>{value}</p>
      <p className={`text-xs ${light ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{label}</p>
    </div>
  );
}

function AreaCard({
  area,
  label,
  icon,
  color,
  answered,
  total,
}: {
  area: string;
  label: string;
  icon: string;
  color: string;
  answered: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <Link
      to={`/practicar?area=${area}`}
      className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <p className="font-bold text-lg">{label}</p>
      <p className="text-sm opacity-80 mb-3">{total} elementos</p>
      <div className="h-1.5 bg-white/30 rounded-full">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs mt-1 opacity-70">{pct}% completado</p>
    </Link>
  );
}

function QuickAction({ to, icon, label, desc }: { to: string; icon: string; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
    </Link>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-center">
      <div className="flex justify-center text-blue-500 dark:text-blue-400 mb-2">{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
