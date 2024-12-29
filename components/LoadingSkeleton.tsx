export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
} 