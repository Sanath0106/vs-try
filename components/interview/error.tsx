'use client';

export default function InterviewError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="text-center space-y-4">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Something went wrong!
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 