"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, Trophy, Target, RefreshCw, ArrowRight, Lightbulb, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateQuizQuestions } from "@/lib/gemini";
import { sounds } from "@/lib/sounds";
import confetti from 'canvas-confetti';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Badge } from "@/components/ui/badge";
import { DecorativeElements } from "@/components/quiz/DecorativeElements";
import { Question, TOPICS, DIFFICULTY_LEVELS } from "@/types/quiz";

export default function QuizContent() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  // Initialize sounds on component mount
  useEffect(() => {
    Object.values(sounds).forEach(sound => sound.init());
  }, []);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isQuizComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 3 && prev > 0) {
            sounds.tick.play();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      sounds.wrong.play();
      handleNextQuestion();
    }
  }, [isStarted, timeLeft, isQuizComplete]);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuizQuestions(topic, difficulty);
      setQuestions(generatedQuestions);
      setIsStarted(true);
      setTimeLeft(15);
      sounds.complete.play();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (!topic || !difficulty) {
      toast({
        title: "Missing Fields",
        description: "Please select both topic and difficulty level.",
        variant: "destructive",
      });
      return;
    }
    generateQuestions();
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
      sounds.correct.play();
    } else {
      sounds.wrong.play();
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
    } else {
      setIsQuizComplete(true);
      sounds.complete.play();
    }
  };

  const handleRestartQuiz = () => {
    setTopic("");
    setDifficulty("");
    setIsStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setScore(0);
    setSelectedAnswer(null);
    setIsQuizComplete(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <DecorativeElements />
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {!isStarted && (
          <div className="text-center mb-6 sm:mb-8">
            <motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Technical Interview Prep
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>15s per question</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <Brain className="w-4 h-4 mr-1" />
                  <span>AI-powered questions</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <Target className="w-4 h-4 mr-1" />
                  <span>Instant feedback</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {!isStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-6 shadow-lg bg-white dark:bg-zinc-950 border border-violet-200 dark:border-violet-800">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Technical Interview Quiz
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  Test your knowledge with timed questions
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Topic</label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="border-violet-200 dark:border-violet-800 hover:border-violet-300 dark:hover:border-violet-700">
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="border-violet-200 dark:border-violet-800 hover:border-violet-300 dark:hover:border-violet-700">
                      <SelectValue placeholder="Choose difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white" 
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Generating Quiz..." : "Start Quiz"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : !isQuizComplete ? (
          <div className="grid lg:grid-cols-[1fr,300px] gap-4 sm:gap-8 max-w-[1800px] mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <h3 className="text-xl sm:text-2xl font-semibold max-w-5xl pr-4">
                  {questions[currentQuestionIndex]?.question}
                </h3>
                <Badge variant="outline" className="self-start sm:self-center shrink-0">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-5">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full min-h-[60px] sm:min-h-[84px] px-4 sm:px-8 py-4 sm:py-6 text-left flex items-start whitespace-normal ${
                      selectedAnswer === option ? 
                      'border-2 border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 
                      'hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                    }`}
                    onClick={() => setSelectedAnswer(option)}
                    disabled={timeLeft === 0}
                  >
                    <span className="text-base sm:text-lg leading-relaxed w-full">
                      {option}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-4">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <Progress
                    value={(currentQuestionIndex / questions.length) * 100}
                    className="w-full sm:w-64 h-2"
                  />
                  <span className="text-sm sm:text-base font-medium whitespace-nowrap">
                    {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
                <Button 
                  onClick={handleNextQuestion}
                  disabled={timeLeft > 0 && !selectedAnswer}
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 min-w-[160px] text-base sm:text-lg py-4 sm:py-6"
                >
                  {timeLeft === 0 ? 'Next' : selectedAnswer ? 'Continue' : 'Select Answer'}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 lg:h-fit lg:sticky lg:top-8">
              <Card className="p-4 sm:p-6 shadow-lg border-l-4 border-violet-500">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Time Left</h3>
                    <p className="text-2xl font-bold text-violet-600">{timeLeft}s</p>
                  </div>
                </div>
                <Progress 
                  value={(timeLeft / 15) * 100}
                  className="h-2"
                />
              </Card>

              <Card className="hidden sm:block p-4 sm:p-6 shadow-lg border-l-4 border-blue-500">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold">Quiz Tips</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">
                        Time Management
                      </h5>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {timeLeft > 10 
                          ? "Take your time to read carefully"
                          : timeLeft > 5
                          ? "Consider options wisely"
                          : "Make your decision quickly!"
                        }
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Strategy
                      </h5>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {!selectedAnswer 
                          ? "Eliminate obviously incorrect options"
                          : "Review before moving forward"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <motion.div className="max-w-3xl mx-auto px-4">
            <Card className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {score === questions.length ? "Perfect Score! 🎉" :
                     score >= questions.length * 0.7 ? "Great Job! 🌟" :
                     "Quiz Complete! 💪"}
                  </h1>
                  <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    {score === questions.length ? (
                      "Outstanding! You've mastered these concepts perfectly. You're definitely ready for your technical interviews!"
                    ) : score >= questions.length * 0.7 ? (
                      `Excellent work! You got ${score} out of ${questions.length} questions right. Keep up the great progress!`
                    ) : (
                      `You scored ${score} out of ${questions.length}. Each attempt helps you learn and improve. Keep practicing!`
                    )}
                  </p>
                </motion.div>
              </div>

              <Card className="p-8 shadow-lg border-t-4 border-violet-500">
                <div className="text-center">
                  <div className="relative inline-block">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Trophy className="w-12 h-12 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute -right-2 -top-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                    >
                      {score}
                    </motion.div>
                  </div>

                  <div className="w-40 mx-auto mb-8">
                    <CircularProgressbar
                      value={(score / questions.length) * 100}
                      text={`${Math.round((score / questions.length) * 100)}%`}
                      styles={buildStyles({
                        pathColor: score === questions.length ? '#22c55e' : '#8b5cf6',
                        textColor: score === questions.length ? '#22c55e' : '#8b5cf6',
                        trailColor: '#e5e7eb',
                        textSize: '20px',
                      })}
                    />
                  </div>

                  <div className="mb-8 text-left bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4 text-violet-700 dark:text-violet-300">
                      Performance Insights
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Topic:</span> {topic}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Difficulty:</span> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Success Rate:</span> {Math.round((score / questions.length) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Question Review</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {questions.map((question, index) => (
                        <div 
                          key={index} 
                          className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 text-left"
                        >
                          <p className="text-sm font-medium mb-2">
                            Question {index + 1}: {question.question}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                                ✓ Correct:
                              </span>
                              <span className="text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                {question.correctAnswer}
                              </span>
                            </div>
                            {question.correctAnswer !== questions[index].options[0] && (
                              <div className="flex items-start gap-2">
                                <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                                  × Your answer:
                                </span>
                                <span className="text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                                  {questions[index].options[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={handleRestartQuiz} 
                      variant="outline" 
                      size="lg"
                      className="font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20"
                    >
                      Try Another Quiz
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-medium"
                      size="lg"
                      onClick={() => {
                        confetti({
                          particleCount: 200,
                          spread: 100,
                          origin: { y: 0.6 }
                        });
                      }}
                    >
                      Celebrate! 🎉
                    </Button>
                  </div>
                </div>
              </Card>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
} 