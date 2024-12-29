export default function InterviewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Loading skeleton */}
          <div className="loading-skeleton h-12 w-3/4" />
          <div className="loading-skeleton h-64" />
          <div className="space-y-4">
            <div className="loading-skeleton h-8 w-1/2" />
            <div className="loading-skeleton h-32" />
          </div>
        </div>
      </div>
    </div>
  );
} 