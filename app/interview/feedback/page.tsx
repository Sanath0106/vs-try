"use client";

import { useState, useEffect } from "react";
import { generateSampleAnswer } from "@/lib/gemini";
import { FeedbackDisplay } from "@/components/interview/FeedbackDisplay";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const storedFeedback = localStorage.getItem('interviewFeedback');
        const jobTitle = localStorage.getItem('jobTitle');
        const experience = localStorage.getItem('experience');
        
        if (!storedFeedback || !jobTitle || !experience) {
          throw new Error('No feedback data found');
        }

        const parsedFeedback = JSON.parse(storedFeedback);
        
        // Get AI sample answers for each question
        const answersWithSamples = await Promise.all(
          parsedFeedback.answers.map(async (answer: any) => {
            try {
              const aiResponse = await generateSampleAnswer(
                answer.questionText,
                jobTitle,
                experience
              );
              return {
                ...answer,
                aiSampleAnswer: aiResponse
              };
            } catch (error) {
              console.error(`Error generating sample answer for question: ${answer.questionText}`, error);
              toast({
                title: "Error",
                description: "Failed to generate some sample answers. Please try again.",
                variant: "destructive",
              });
              // Return answer without AI sample if there's an error
              return answer;
            }
          })
        );

        setFeedback({
          ...parsedFeedback,
          answers: answersWithSamples
        });
      } catch (error: any) {
        console.error('Error loading feedback:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No Feedback Available</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Please complete an interview first to see feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Interview Feedback</h1>
      <div className="space-y-8">
        {feedback.answers.map((answer: any, index: number) => (
          <FeedbackDisplay
            key={index}
            question={answer.questionText}
            userAnswer={answer.answer}
            feedback={{
              aiAnswer: answer.aiSampleAnswer?.sampleAnswer || "Sample answer not available",
              keyTakeaways: answer.aiSampleAnswer?.keyTakeaways || [],
              summary: answer.aiSampleAnswer?.summary || "Summary not available"
            }}
          />
        ))}
      </div>
    </div>
  );
} 