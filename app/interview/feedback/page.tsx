"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Home, ThumbsUp, Star, Brain, CheckCircle2, AlertCircle, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeedbackData {
  answers: {
    questionId: number;
    questionText: string;
    answer: string;
  }[];
  feedback: {
    answers: {
      questionId: number;
      strengths: string[];
      improvements: string[];
    }[];
    overallFeedback: {
      rating: number;
      positivePoints: string[];
      improvementAreas: string[];
      summary: string;
    };
  };
  jobTitle: string;
  experience: string;
  jobDescription?: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedFeedback = localStorage.getItem('interviewFeedback');
    const storedJobTitle = localStorage.getItem('jobTitle');
    const storedExperience = localStorage.getItem('experience');
    const storedJobDescription = localStorage.getItem('jobDescription');

    if (storedFeedback) {
      setFeedback({
        ...JSON.parse(storedFeedback),
        jobTitle: storedJobTitle || '',
        experience: storedExperience || '',
        jobDescription: storedJobDescription || undefined
      });
    }
    setIsLoading(false);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-violet-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  if (isLoading || !feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400">Analyzing your interview...</p>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              No feedback available. Please complete an interview first.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-violet-600"
            >
              Return to Dashboard
            </Button>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              Interview Analysis
            </h1>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Questions and Answers */}
            <div className="space-y-6">
              {feedback.answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="p-4 bg-white/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                          Question {index + 1}
                        </h3>
                        <span className="text-sm text-zinc-500">
                          {feedback.feedback.answers[index]?.strengths.length} strengths • {feedback.feedback.answers[index]?.improvements.length} improvements
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Question */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                          <Brain className="h-5 w-5" />
                          <h4 className="font-medium">Question</h4>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 pl-7">
                          {answer.questionText}
                        </p>
                      </div>

                      {/* Your Answer */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Star className="h-5 w-5" />
                          <h4 className="font-medium">Your Answer</h4>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 pl-7">
                          {answer.answer}
                        </p>
                      </div>

                      {/* AI Example Answer */}
                      <div className="space-y-2 bg-violet-50/50 dark:bg-violet-900/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                          <Bot className="h-5 w-5" />
                          <h4 className="font-medium">Sample Strong Answer</h4>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 pl-7">
                          {`I became interested in the ${feedback.jobTitle} role because of my passion for building robust, scalable applications. 
                          During my computer science studies, I was particularly drawn to ${
                            feedback.jobTitle.includes('Java') ? "Java's object-oriented principles" : 
                            feedback.jobTitle.includes('React') ? "React's component-based architecture" :
                            feedback.jobTitle.includes('Python') ? "Python's versatility" :
                            "the technology's core principles"
                          } and its extensive ecosystem. I've spent the last ${feedback.experience} years working with ${
                            feedback.jobTitle.split(' ')[0]
                          } and related technologies, developing enterprise applications. What excites me most about this role is the opportunity to work on ${
                            feedback.jobDescription || 'challenging projects'
                          } while leveraging modern development practices for building efficient, maintainable solutions. I'm particularly interested in your company's technical challenges and innovative approach to problem-solving, as it aligns perfectly with my technical interests and career goals.`}
                        </p>
                        
                        <div className="mt-4 pl-7">
                          <h5 className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-2">
                            Key Elements of a Strong Answer:
                          </h5>
                          <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                            <li>Shows genuine enthusiasm for the technology</li>
                            <li>Demonstrates relevant experience ({feedback.experience} years)</li>
                            <li>Connects personal interests with the role</li>
                            <li>Mentions specific technical skills</li>
                            <li>References company-specific details</li>
                          </ul>
                        </div>
                      </div>

                      {/* Feedback */}
                      {feedback.feedback.answers[index] && (
                        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                          {/* Strengths */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-600">
                              <ThumbsUp className="h-5 w-5" />
                              <h4 className="font-medium">Strengths</h4>
                            </div>
                            <ul className="space-y-1 pl-7">
                              {feedback.feedback.answers[index].strengths.map((strength, i) => (
                                <li key={i} className="text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Improvements */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-amber-600">
                              <AlertCircle className="h-5 w-5" />
                              <h4 className="font-medium">Areas for Improvement</h4>
                            </div>
                            <ul className="space-y-1 pl-7">
                              {feedback.feedback.answers[index].improvements.map((improvement, i) => (
                                <li key={i} className="text-sm text-amber-600 dark:text-amber-400 flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Overall Score</h2>
                <div className={`text-6xl font-bold ${getScoreColor(feedback.feedback.overallFeedback.rating)}`}>
                  {feedback.feedback.overallFeedback.rating}
                </div>
                <p className="text-sm text-zinc-500 mt-2">out of 100</p>
              </div>
            </Card>

            {/* Summary */}
            <Card className="p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <h2 className="text-lg font-semibold mb-4">Interview Summary</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {feedback.feedback.overallFeedback.summary}
              </p>
            </Card>

            {/* Key Takeaways */}
            <Card className="p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <h2 className="text-lg font-semibold mb-4">Key Takeaways</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-emerald-600 mb-2">Strengths</h3>
                  <ul className="space-y-2">
                    {feedback.feedback.overallFeedback.positivePoints.map((point, i) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-600 mb-2">Focus Areas</h3>
                  <ul className="space-y-2">
                    {feedback.feedback.overallFeedback.improvementAreas.map((area, i) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 