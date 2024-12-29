"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TypingEffect from "@/components/ui/typing-effect";

interface InterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InterviewDialog({ isOpen, onClose }: InterviewDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    yearsOfExperience: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        title: formData.jobTitle,
        description: formData.jobDescription,
        experience: formData.yearsOfExperience,
      });

      router.push(`/interview?${params.toString()}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsLoading(false);
    }
  };

  const steps = [
    {
      field: "jobTitle",
      label: "What role are you interviewing for?",
      placeholder: "e.g. Senior Frontend Developer",
      type: "input"
    },
    {
      field: "jobDescription",
      label: "Any specific requirements? (Optional)",
      placeholder: "Paste the job description or add key requirements...",
      type: "textarea"
    },
    {
      field: "yearsOfExperience",
      label: "How many years of experience do you have?",
      placeholder: "e.g. 5",
      type: "number"
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
        
        <div className="relative p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Start Interview Session
            </DialogTitle>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TypingEffect 
                text="Let's prepare you for your interview. Please provide some details."
                className="text-zinc-600 dark:text-zinc-400 mt-2"
              />
            </motion.div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Label className="text-lg font-medium">
                <TypingEffect 
                  text={currentStepData.label}
                  delay={300}
                />
              </Label>

              {currentStepData.type === "textarea" ? (
                <Textarea
                  value={formData[currentStepData.field as keyof typeof formData]}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    [currentStepData.field]: e.target.value 
                  }))}
                  placeholder={currentStepData.placeholder}
                  className="h-32 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-white/20"
                />
              ) : (
                <Input
                  type={currentStepData.type}
                  value={formData[currentStepData.field as keyof typeof formData]}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    [currentStepData.field]: e.target.value 
                  }))}
                  placeholder={currentStepData.placeholder}
                  className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-white/20"
                  required={currentStepData.field !== "jobDescription"}
                />
              )}
            </motion.div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Back
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.jobTitle || !formData.yearsOfExperience}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
                  >
                    {isLoading ? "Starting..." : "Start Interview"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={currentStep === 0 && !formData.jobTitle}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </form>

          {/* Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 