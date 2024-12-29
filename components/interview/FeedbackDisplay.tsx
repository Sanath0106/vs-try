import { CheckCircle2, AlertCircle, ArrowRight, Code2, BookOpen, Target } from 'lucide-react';

interface FeedbackProps {
  question: string;
  userAnswer: string;
  feedback: {
    aiAnswer: string;
    technicalAccuracy: string[];
    suggestedImprovements: {
      point: string;
      explanation: string;
    }[];
    codeExample?: string;
  };
}

export function FeedbackDisplay({ question, userAnswer, feedback }: FeedbackProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Question Section */}
      <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-violet-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-100">
              Interview Question
            </h2>
            <p className="mt-2 text-violet-800 dark:text-violet-200 leading-relaxed">
              {question}
            </p>
          </div>
        </div>
      </div>

      {/* User Answer Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <Target className="h-6 w-6 text-blue-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Your Response
            </h2>
            <p className="mt-2 text-blue-800 dark:text-blue-200 leading-relaxed">
              {userAnswer || "No answer provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Model Answer Section */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              Ideal Answer Approach
            </h2>
            <div className="mt-2 text-emerald-800 dark:text-emerald-200 leading-relaxed">
              {feedback.aiAnswer}
            </div>
            {feedback.codeExample && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                  <Code2 className="h-4 w-4" />
                  <span>Example Implementation</span>
                </div>
                <pre className="bg-emerald-950/10 dark:bg-emerald-900/20 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-emerald-700 dark:text-emerald-300">
                    {feedback.codeExample}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Technical Points */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
              Key Technical Points
            </h2>
            <ul className="mt-4 space-y-3">
              {feedback.technicalAccuracy.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-indigo-800 dark:text-indigo-200">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {feedback.suggestedImprovements.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                Areas for Improvement
              </h2>
              <div className="mt-4 space-y-4">
                {feedback.suggestedImprovements.map((improvement, index) => (
                  <div 
                    key={index}
                    className="bg-orange-500/5 rounded-lg p-4"
                  >
                    <h3 className="font-medium text-orange-800 dark:text-orange-200">
                      {improvement.point}
                    </h3>
                    <p className="mt-2 text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                      {improvement.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 