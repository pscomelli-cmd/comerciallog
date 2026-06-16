import { useProgressContext } from '../context/ProgressContext';
import { allContent } from '../data';
import { TOPICS } from '../data/topics';
import type { Topic } from '../data/types';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

export default function Statistics() {
  const { progress, globalAccuracy, resetProgress } = useProgressContext();

  const accuracy = globalAccuracy();
  const totalAnswered = Object.values(progress.items).reduce(
    (s, v) => s + v.correct + v.incorrect,
    0,
  );

  const topicStats = TOPICS.map((topic) => {
    const topicItems = allContent.filter((i) => i.topic === topic.id);
    const ids = topicItems.map((i) => i.id);
    const answered = ids
      .map((id) => progress.items[id])
      .filter(Boolean);
    const total = answered.reduce((s, v) => s + v.correct + v.incorrect, 0);
    const correct = answered.reduce((s, v) => s + v.correct, 0);
    const acc = total > 0 ? Math.round((correct / total) * 100) : null;
    return { topic, acc, total, correct, itemCount: topicItems.length };
  });

  const commercial = topicStats.filter((t) => t.topic.area === 'comercial');
  const logistics = topicStats.filter((t) => t.topic.area === 'logistica');

  const weakTopics = topicStats
    .filter((t) => t.acc !== null && t.acc < 70)
    .sort((a, b) => (a.acc ?? 100) - (b.acc ?? 100))
    .slice(0, 3);

  const recentSessions = progress.sessions.slice(0, 5);

  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      <h1 className="text-xl font-bold">Estadísticas</h1>

      {/* Global */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlobalStat label="Precisión global" value={accuracy !== null ? `${accuracy}%` : '—'} />
        <GlobalStat label="Respuestas totales" value={totalAnswered.toString()} />
        <GlobalStat label="Racha actual" value={`${progress.streakDays} días`} />
        <GlobalStat label="Sesiones" value={progress.sessions.length.toString()} />
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3">⚠️ Temas más flojos</h2>
          <div className="space-y-2">
            {weakTopics.map(({ topic, acc }) => (
              <Link
                key={topic.id}
                to={`/sesion?area=${topic.area}&topic=${topic.id}&mode=mixto`}
                className="flex items-center justify-between bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{topic.icon}</span>
                  <span className="text-sm font-medium">{topic.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{acc}%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">→ Practicar</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comercial */}
      <section>
        <h2 className="text-base font-semibold mb-3">💰 Comercial</h2>
        <div className="space-y-2">
          {commercial.map((t) => (
            <TopicRow key={t.topic.id} {...t} />
          ))}
        </div>
      </section>

      {/* Logística */}
      <section>
        <h2 className="text-base font-semibold mb-3">🚚 Logística</h2>
        <div className="space-y-2">
          {logistics.map((t) => (
            <TopicRow key={t.topic.id} {...t} />
          ))}
        </div>
      </section>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3">📅 Sesiones recientes</h2>
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {s.mode} · {s.area === 'all' ? 'Todas las áreas' : s.area}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(s.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {s.correct}/{s.totalItems}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      s.correct / s.totalItems >= 0.7
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {Math.round((s.correct / s.totalItems) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reset */}
      <button
        onClick={handleReset}
        className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 hover:underline"
      >
        <RefreshCw size={14} />
        Reiniciar progreso
      </button>
    </div>
  );
}

function GlobalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function TopicRow({
  topic,
  acc,
  total,
  correct,
  itemCount,
}: {
  topic: { id: Topic; label: string; icon: string; area: string };
  acc: number | null;
  total: number;
  correct: number;
  itemCount: number;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{topic.icon}</span>
          <span className="text-sm font-medium">{topic.label}</span>
        </div>
        <span
          className={`text-sm font-bold ${
            acc === null
              ? 'text-gray-400'
              : acc >= 80
                ? 'text-green-600 dark:text-green-400'
                : acc >= 60
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-500 dark:text-red-400'
          }`}
        >
          {acc !== null ? `${acc}%` : '—'}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            acc === null
              ? 'bg-gray-300 dark:bg-gray-600'
              : acc >= 80
                ? 'bg-green-500'
                : acc >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
          }`}
          style={{ width: `${acc ?? 0}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {total > 0 ? `${correct}/${total} correctas · ` : ''}{itemCount} elementos en banco
      </p>
    </div>
  );
}
