<section className="mb-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">Code Debugger</h2>
    <Button asChild>
      <Link href="/debugger">
        <Bug className="w-4 h-4 mr-2" />
        Start Debugging
      </Link>
    </Button>
  </div>
  <Card className="p-6">
    <div className="flex items-start space-x-4">
      <div className="bg-violet-100 dark:bg-violet-900/20 p-3 rounded-lg">
        <Bug className="w-6 h-6 text-violet-600 dark:text-violet-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">Debug Real Code</h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Practice debugging with real-world scenarios. Choose from various DSA topics
          and difficulty levels to improve your problem-solving skills.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Data Structures</Badge>
          <Badge variant="secondary">Algorithms</Badge>
          <Badge variant="secondary">Problem Solving</Badge>
        </div>
      </div>
    </div>
  </Card>
</section> 