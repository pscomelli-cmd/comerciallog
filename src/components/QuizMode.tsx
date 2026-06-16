import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { QuizQuestion } from '../data/types';

interface QuizModeProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function QuizMode({ question, onAnswer }: QuizModeProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    setTimeout(() => onAnswer(optionId === question.correctOptionId), 1200);
  };

  const getOptionStyle = (id: string) => {
    if (!selected) {
      return 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer';
    }
    if (id === question.correctOptionId) {
      return 'border-green-500 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200';
    }
    if (id === selected) {
      return 'border-red-400 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200';
    }
    return 'border-gray-200 dark:border-gray-700 opacity-50';
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
            Quiz
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            question.difficulty === 'facil'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : question.difficulty === 'medio'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {question.difficulty}
          </span>
        </div>
        <p className="text-lg font-medium leading-snug">{question.question}</p>
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${getOptionStyle(opt.id)}`}
          >
            <span className="w-7 h-7 rounded-full border-2 border-current flex-shrink-0 flex items-center justify-center text-sm font-bold uppercase">
              {opt.id}
            </span>
            <span className="text-sm leading-snug">{opt.text}</span>
            {selected && opt.id === question.correctOptionId && (
              <CheckCircle size={18} className="ml-auto text-green-500 flex-shrink-0" />
            )}
            {selected && opt.id === selected && opt.id !== question.correctOptionId && (
              <XCircle size={18} className="ml-auto text-red-500 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div
          className={`rounded-xl p-4 border-l-4 text-sm leading-relaxed animate-fade-in ${
            selected === question.correctOptionId
              ? 'bg-green-50 dark:bg-green-950 border-green-500 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950 border-red-400 text-red-800 dark:text-red-200'
          }`}
        >
          <strong className="block mb-1">
            {selected === question.correctOptionId ? '✓ ¡Correcto!' : '✗ Incorrecto'}
          </strong>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
