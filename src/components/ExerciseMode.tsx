import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { NumericalExercise } from '../data/types';

interface ExerciseModeProps {
  exercise: NumericalExercise;
  onAnswer: (correct: boolean) => void;
}

export default function ExerciseMode({ exercise, onAnswer }: ExerciseModeProps) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const validate = () => {
    const userVal = parseFloat(input.replace(',', '.'));
    if (isNaN(userVal)) return;

    const diff = Math.abs(userVal - exercise.answer) / Math.abs(exercise.answer || 1);
    const isCorrect = diff <= exercise.tolerance;

    setStatus(isCorrect ? 'correct' : 'incorrect');
    setAttempts((a) => a + 1);

    if (isCorrect) {
      setTimeout(() => onAnswer(true), 1000);
    } else if (attempts >= 1) {
      setShowHint(true);
    }
  };

  const skip = () => {
    setShowSteps(true);
    setTimeout(() => onAnswer(false), 0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
            Ejercicio
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            exercise.difficulty === 'facil'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : exercise.difficulty === 'medio'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {exercise.difficulty}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">{exercise.title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{exercise.statement}</p>
        </div>

        {/* Data table */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Datos</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {Object.entries(exercise.data).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="text-gray-500 dark:text-gray-400 shrink-0">{k}:</dt>
                <dd className="font-mono font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Formula */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">Fórmula</p>
          <code className="font-mono text-blue-800 dark:text-blue-200">{exercise.formula}</code>
        </div>
      </div>

      {/* Input */}
      {status !== 'correct' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <label className="block text-sm font-medium">Tu respuesta ({exercise.unit})</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              value={input}
              onChange={(e) => { setInput(e.target.value); setStatus('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && validate()}
              placeholder="0.00"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent text-lg font-mono focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
            <span className="flex items-center px-3 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium">
              {exercise.unit}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={validate}
              disabled={!input}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Comprobar
            </button>
            <button
              onClick={skip}
              className="px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm transition-colors"
            >
              Ver solución
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {status === 'correct' && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl p-4 text-green-800 dark:text-green-200 text-sm animate-fade-in">
          <strong className="text-base block mb-1">✓ ¡Correcto!</strong>
          Respuesta: <strong>{exercise.answer} {exercise.unit}</strong>
        </div>
      )}

      {status === 'incorrect' && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-800 dark:text-red-200 text-sm animate-fade-in">
          <strong className="block mb-1">✗ No es correcto</strong>
          {attempts === 1 ? 'Inténtalo de nuevo.' : 'Revisa la pista o mira la solución.'}
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 text-sm flex gap-3">
          <Lightbulb size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800 dark:text-yellow-200">{exercise.hint}</p>
        </div>
      )}

      {!showHint && status === 'incorrect' && attempts > 0 && (
        <button
          onClick={() => setShowHint(true)}
          className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
        >
          <Lightbulb size={15} /> Ver pista
        </button>
      )}

      {/* Steps */}
      <div>
        <button
          onClick={() => setShowSteps((s) => !s)}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {showSteps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showSteps ? 'Ocultar resolución' : 'Ver resolución paso a paso'}
        </button>

        {showSteps && (
          <div className="mt-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-3 animate-fade-in">
            {exercise.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="text-sm space-y-0.5">
                  <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                  {step.formula && (
                    <code className="block font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {step.formula}
                    </code>
                  )}
                  {step.result && (
                    <p className="font-semibold text-blue-700 dark:text-blue-300">→ {step.result}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-800 dark:text-gray-100">
              Resultado: {exercise.answer} {exercise.unit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
