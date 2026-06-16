import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { Flashcard } from '../data/types';

interface FlashcardModeProps {
  card: Flashcard;
  box?: number;
  onAnswer: (knew: boolean) => void;
}

export default function FlashcardMode({ card, box, onAnswer }: FlashcardModeProps) {
  const [flipped, setFlipped] = useState(false);

  const handleAnswer = (knew: boolean) => {
    setFlipped(false);
    setTimeout(() => onAnswer(knew), 150);
  };

  return (
    <div className="space-y-4">
      {/* Box indicator */}
      {box !== undefined && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 px-2 py-0.5 rounded-full">
            Flashcard
          </span>
          <span>Caja Leitner:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((b) => (
              <div
                key={b}
                className={`w-4 h-4 rounded-sm ${
                  b <= box
                    ? 'bg-orange-400 dark:bg-orange-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className="relative cursor-pointer"
        style={{ perspective: '1000px', minHeight: '240px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '240px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-widest">Pregunta</p>
            <p className="text-lg font-semibold leading-snug">{card.front}</p>
            <div className="mt-6 flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs">
              <RefreshCw size={12} />
              <span>Toca para ver la respuesta</span>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-blue-600 dark:bg-blue-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xs text-blue-200 mb-4 uppercase tracking-widest">Respuesta</p>
            <p className="text-white font-medium leading-relaxed whitespace-pre-line">{card.back}</p>
            {card.formula && (
              <code className="mt-3 text-blue-100 bg-blue-700 dark:bg-blue-900 px-3 py-1.5 rounded-lg text-sm font-mono">
                {card.formula}
              </code>
            )}
            {card.example && (
              <p className="mt-3 text-blue-200 text-xs italic">Ej: {card.example}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {flipped && (
        <div className="flex gap-3 animate-fade-in">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-xl font-medium text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            ✗ No la sabía
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-xl font-medium text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            ✓ La sabía
          </button>
        </div>
      )}

      {!flipped && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Toca la tarjeta para ver la respuesta
        </p>
      )}
    </div>
  );
}
