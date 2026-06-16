import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { TOPICS, getTopicsByArea } from '../data/topics';
import type { Area, Topic, PracticeMode } from '../data/types';

const AREAS = [
  { id: 'comercial' as Area, label: 'Comercial', icon: '💰', color: 'from-emerald-500 to-teal-600' },
  { id: 'logistica' as Area, label: 'Logística', icon: '🚚', color: 'from-orange-500 to-amber-600' },
];

const MODES = [
  { id: 'quiz' as PracticeMode, label: 'Quiz', icon: '❓', desc: 'Preguntas de opción múltiple' },
  { id: 'ejercicio' as PracticeMode, label: 'Ejercicios', icon: '🔢', desc: 'Problemas numéricos con resolución paso a paso' },
  { id: 'flashcard' as PracticeMode, label: 'Flashcards', icon: '🃏', desc: 'Repaso espaciado con sistema Leitner' },
  { id: 'mixto' as PracticeMode, label: 'Mixto', icon: '🎲', desc: 'Combina quiz, ejercicios y flashcards' },
];

export default function PracticeSetup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initArea = (params.get('area') as Area) ?? null;
  const initMode = (params.get('mode') as PracticeMode) ?? null;

  const [step, setStep] = useState<'area' | 'topic' | 'mode'>(
    initArea ? (initMode ? 'mode' : 'topic') : 'area',
  );
  const [selectedArea, setSelectedArea] = useState<Area | null>(initArea);
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'all'>('all');
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(initMode);

  const topicsForArea = selectedArea ? getTopicsByArea(selectedArea) : TOPICS;

  const start = () => {
    if (!selectedMode) return;
    const q = new URLSearchParams();
    if (selectedArea) q.set('area', selectedArea);
    q.set('topic', selectedTopic);
    q.set('mode', selectedMode);
    navigate(`/sesion?${q.toString()}`);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      <div className="flex items-center gap-3">
        {step !== 'area' && (
          <button
            onClick={() => {
              if (step === 'topic') setStep('area');
              else setStep('topic');
            }}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold">
          {step === 'area' && 'Elige un área'}
          {step === 'topic' && 'Elige un tema'}
          {step === 'mode' && 'Modo de práctica'}
        </h1>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <StepDot active={step === 'area'} done={step !== 'area'} label="Área" />
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <StepDot active={step === 'topic'} done={step === 'mode'} label="Tema" />
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <StepDot active={step === 'mode'} done={false} label="Modo" />
      </div>

      {/* Step: Area */}
      {step === 'area' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => {
                setSelectedArea(area.id);
                setSelectedTopic('all');
                setStep('topic');
              }}
              className={`bg-gradient-to-br ${area.color} rounded-2xl p-6 text-white text-left hover:scale-[1.02] transition-transform`}
            >
              <div className="text-4xl mb-3">{area.icon}</div>
              <p className="text-xl font-bold">{area.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step: Topic */}
      {step === 'topic' && selectedArea && (
        <div className="space-y-2">
          <button
            onClick={() => { setSelectedTopic('all'); setStep('mode'); }}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-colors flex items-center justify-between ${
              selectedTopic === 'all'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <div>
              <p className="font-semibold text-sm">Todos los temas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mezcla de todos los temas del área</p>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </button>
          {topicsForArea.map((topic) => (
            <button
              key={topic.id}
              onClick={() => { setSelectedTopic(topic.id); setStep('mode'); }}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-colors flex items-center justify-between ${
                selectedTopic === topic.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{topic.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{topic.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{topic.description}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* Step: Mode */}
      {step === 'mode' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-colors ${
                  selectedMode === mode.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="text-3xl mb-2">{mode.icon}</div>
                <p className="font-bold text-sm">{mode.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mode.desc}</p>
              </button>
            ))}
          </div>

          {selectedMode && (
            <button
              onClick={start}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Empezar sesión <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
          done
            ? 'bg-blue-500 text-white'
            : active
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-2 border-blue-500'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
        }`}
      >
        {done ? '✓' : '·'}
      </div>
      <span className={`text-xs ${active ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
