import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import QuizMode from '../components/QuizMode';
import ExerciseMode from '../components/ExerciseMode';
import FlashcardMode from '../components/FlashcardMode';
import ProgressBar from '../components/ProgressBar';
import { getSessionItems } from '../data';
import type { Area, Topic, PracticeMode, ContentItem, SessionResult } from '../data/types';
import { useProgressContext } from '../context/ProgressContext';

const SESSION_SIZE = 10;

export default function PracticeSession() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { recordAnswer, recordFlashcard, saveSession, progress } = useProgressContext();

  const area = (params.get('area') as Area) || 'all';
  const topic = (params.get('topic') as Topic) || 'all';
  const mode = (params.get('mode') as PracticeMode) || 'mixto';

  const [items] = useState<ContentItem[]>(() =>
    getSessionItems(area as Area | 'all', topic as Topic | 'all', mode, SESSION_SIZE),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startTime] = useState(Date.now());
  const [done, setDone] = useState(false);
  const savedRef = useRef(false);

  const current = items[currentIndex];

  useEffect(() => {
    if (done && !savedRef.current) {
      savedRef.current = true;
      const session: SessionResult = {
        id: `${Date.now()}`,
        date: Date.now(),
        area: area as Area | 'all',
        topic: topic as Topic | 'all',
        mode,
        totalItems: items.length,
        correct,
        durationSeconds: Math.round((Date.now() - startTime) / 1000),
      };
      saveSession(session);
      navigate(`/resultados?correct=${correct}&total=${items.length}&duration=${session.durationSeconds}&mode=${mode}`);
    }
  }, [done]);

  const handleAnswer = (isCorrect: boolean) => {
    if (current.type !== 'flashcard') {
      recordAnswer(current.id, isCorrect);
    } else {
      recordFlashcard(current.id, isCorrect);
    }
    if (isCorrect) setCorrect((c) => c + 1);

    const next = currentIndex + 1;
    if (next >= items.length) {
      setDone(true);
    } else {
      setCurrentIndex(next);
    }
  };

  if (!items.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">No hay contenido disponible para esta selección.</p>
        <button onClick={() => navigate('/practicar')} className="mt-4 text-blue-600 underline">
          Volver a elegir
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const flashcardBox = current?.type === 'flashcard'
    ? (progress.flashcards[current.id]?.box ?? 1)
    : undefined;

  return (
    <div className="space-y-5 pb-20 sm:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/practicar')}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex-1">
          <ProgressBar current={currentIndex} total={items.length} correct={correct} />
        </div>
      </div>

      {/* Content */}
      {current.type === 'quiz' && (
        <QuizMode question={current} onAnswer={handleAnswer} />
      )}
      {current.type === 'ejercicio' && (
        <ExerciseMode exercise={current} onAnswer={handleAnswer} />
      )}
      {current.type === 'flashcard' && (
        <FlashcardMode card={current} box={flashcardBox} onAnswer={handleAnswer} />
      )}
    </div>
  );
}
