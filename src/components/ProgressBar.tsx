interface ProgressBarProps {
  current: number;
  total: number;
  correct?: number;
}

export default function ProgressBar({ current, total, correct }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {current}/{total}
        </span>
        {correct !== undefined && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✓ {correct} correctas
          </span>
        )}
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
