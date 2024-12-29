"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Speaker, SkipForward, X, Loader2, AlertCircle, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  expectedTopics?: string[];
}

interface InterviewQuestionsProps {
  jobTitle: string;
  jobDescription?: string;
  experience: string;
}

interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
  feedback?: string;
}

export default function InterviewQuestions({ jobTitle, jobDescription, experience }: InterviewQuestionsProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout>();

  // Speech recognition setup
  const recognition = typeof window !== 'undefined' 
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() 
    : null;

  useEffect(() => {
    generateQuestions();
  }, [jobTitle, experience]); // Add dependencies to ensure questions are generated when props change

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobTitle, 
          jobDescription, 
          experience 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        throw new Error('Invalid questions format received');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate questions');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAnswer = async (answer: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].text,
          answer,
          jobTitle,
          experience,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze answer');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error analyzing answer:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitWrittenAnswer = async () => {
    if (writtenAnswer.trim()) {
      await analyzeAnswer(writtenAnswer);
    }
  };

  const startRecording = async () => {
    try {
      if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = () => {
          setIsRecording(true);
          recordingTimer.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
        };

        recognition.onend = () => {
          clearInterval(recordingTimer.current);
          setIsRecording(false);
          setRecordingTime(0);
        };
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(transcript);
          setWrittenAnswer(transcript);
        };

        recognition.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  // Initialize speech synthesis and select voice
  useEffect(() => {
    const initVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a female English voice first (they often sound more natural)
      const preferredVoice = voices.find(
        voice => voice.lang.startsWith('en-') && voice.name.includes('Female')
      ) || voices.find(
        // Fallback to any English voice
        voice => voice.lang.startsWith('en-')
      ) || voices[0]; // Final fallback to any available voice
      
      setSelectedVoice(preferredVoice);
    };

    // Handle both immediate and async voice loading
    if (window.speechSynthesis.getVoices().length) {
      initVoice();
    }
    window.speechSynthesis.onvoiceschanged = initVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && selectedVoice) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use the selected voice consistently
      utterance.voice = selectedVoice;
      
      // Configure speech settings
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      return utterance;
    }
    return null;
  };

  // Speak new question whenever currentQuestionIndex changes
  useEffect(() => {
    if (questions[currentQuestionIndex] && selectedVoice) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        const utterance = speakText(questions[currentQuestionIndex].text);
        if (utterance) {
          utterance.onend = () => setIsSpeaking(false);
          setIsSpeaking(true);
          window.speechSynthesis.speak(utterance);
        }
      }, 500);
    }
  }, [currentQuestionIndex, questions, selectedVoice]);

  // Move VOICE_PERSONALITIES inside the component
  const VOICE_PERSONALITIES = {
    welcome: [
      () => `Hello! I'm your AI interviewer for the ${jobTitle} position. We'll be going through ${questions.length} questions to assess your experience and skills. Feel free to take your time with each answer.`,
      () => `Welcome to your ${jobTitle} interview! I'll be asking you ${questions.length} questions today. Remember, you can either speak your answers or type them.`,
      () => `Hi there! I'm excited to learn about your ${jobTitle} experience. We have ${questions.length} questions prepared for you. Let's begin when you're ready.`
    ],
    transition: [
      "Thank you for that answer. Let's move on to the next question.",
      "Excellent. Moving forward to our next topic.",
      "Great. Let's continue with the next question."
    ],
    completion: [
      () => `Thank you for completing all ${questions.length} questions. I'll now analyze your responses to provide comprehensive feedback.`,
      "That concludes our interview questions. I'll analyze your responses and prepare detailed feedback for you.",
      "Thank you for your time and thoughtful answers. I'll now process your responses and generate feedback."
    ]
  };

  // Update the getRandomMessage function
  const getRandomMessage = (type: keyof typeof VOICE_PERSONALITIES) => {
    const messages = VOICE_PERSONALITIES[type];
    const message = messages[Math.floor(Math.random() * messages.length)];
    // If message is a function, call it, otherwise return as is
    return typeof message === 'function' ? message() : message;
  };

  // Welcome message with personality
  useEffect(() => {
    if (questions.length > 0 && selectedVoice && currentQuestionIndex === 0) {
      const welcomeMessage = getRandomMessage('welcome');
      const utterance = speakText(welcomeMessage);
      
      if (utterance) {
        utterance.onend = () => {
          setIsSpeaking(false);
          // Speak first question after welcome
          setTimeout(() => {
            const questionUtterance = speakText(questions[0].text);
            if (questionUtterance) {
              questionUtterance.onend = () => setIsSpeaking(false);
              setIsSpeaking(true);
              window.speechSynthesis.speak(questionUtterance);
            }
          }, 1000);
        };
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [questions.length, selectedVoice, jobTitle]); // Add jobTitle to dependencies

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript("");
      setWrittenAnswer("");
      setFeedback("");
    }
  };

  const endInterview = async () => {
    try {
      // First, add the final answer if there's one
      if (writtenAnswer.trim()) {
        setAnswers(prev => [...prev, {
          questionId: questions[currentQuestionIndex].id,
          questionText: questions[currentQuestionIndex].text,
          answer: writtenAnswer
        }]);
      }

      const response = await fetch('/api/analyze-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: [
            ...answers,
            // Include current answer if it exists
            ...(writtenAnswer.trim() ? [{
              questionId: questions[currentQuestionIndex].id,
              questionText: questions[currentQuestionIndex].text,
              answer: writtenAnswer
            }] : [])
          ],
          jobTitle,
          experience
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze interview');
      }

      // Store feedback in localStorage
      localStorage.setItem('interviewFeedback', JSON.stringify({
        answers: [
          ...answers,
          ...(writtenAnswer.trim() ? [{
            questionId: questions[currentQuestionIndex].id,
            questionText: questions[currentQuestionIndex].text,
            answer: writtenAnswer
          }] : [])
        ],
        feedback: data.feedback
      }));

      router.push('/interview/feedback');
    } catch (error) {
      console.error('Error analyzing interview:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze interview');
    }
  };

  const handleSubmitAnswer = async () => {
    if (writtenAnswer.trim()) {
      // Store the answer
      setAnswers(prev => [...prev, {
        questionId: questions[currentQuestionIndex].id,
        questionText: questions[currentQuestionIndex].text,
        answer: writtenAnswer
      }]);

      if (currentQuestionIndex < questions.length - 1) {
        const transitionMessage = getRandomMessage('transition');
        const utterance = speakText(transitionMessage);
        
        if (utterance) {
          utterance.onend = () => {
            setCurrentQuestionIndex(prev => prev + 1);
            setWrittenAnswer("");
            setTranscript("");
            // Speak next question after transition
            setTimeout(() => {
              const questionUtterance = speakText(questions[currentQuestionIndex + 1].text);
              if (questionUtterance) {
                questionUtterance.onend = () => setIsSpeaking(false);
                setIsSpeaking(true);
                window.speechSynthesis.speak(questionUtterance);
              }
            }, 500);
          };
          setIsSpeaking(true);
          window.speechSynthesis.speak(utterance);
        }
      } else {
        const completionMessage = getRandomMessage('completion');
        const utterance = speakText(completionMessage);
        
        if (utterance) {
          utterance.onend = () => endInterview();
          setIsSpeaking(true);
          window.speechSynthesis.speak(utterance);
        } else {
          await endInterview();
        }
      }

      // Store interview context
      localStorage.setItem('jobTitle', jobTitle);
      localStorage.setItem('experience', experience);
      if (jobDescription) {
        localStorage.setItem('jobDescription', jobDescription);
      }
    }
  };

  // Remove the manual speakQuestion function since we're using useEffect
  const speakQuestion = () => {
    if (!isSpeaking && questions[currentQuestionIndex]) {
      const utterance = speakText(questions[currentQuestionIndex].text);
      if (utterance) {
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
          <Button onClick={generateQuestions} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-600" />
          <p className="text-zinc-600 dark:text-zinc-400">
            Generating interview questions...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-xl border-2 border-violet-500/10 dark:border-violet-500/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg shadow-violet-500/5"
        >
          <div className="p-6 space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-lg font-medium">
                  {currentQuestionIndex + 1}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-violet-500 dark:text-violet-400">
                    {questions[currentQuestionIndex]?.difficulty} • {questions[currentQuestionIndex]?.category}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={speakQuestion}
                disabled={isSpeaking}
                className="hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                <Speaker className={`h-5 w-5 ${isSpeaking ? 'text-violet-600 animate-pulse' : ''}`} />
              </Button>
            </div>

            {/* Question Content */}
            <div className="bg-violet-50/50 dark:bg-violet-900/10 rounded-lg p-4 border border-violet-100 dark:border-violet-900/20">
              <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                {questions[currentQuestionIndex]?.text || "Loading question..."}
              </h3>
              {questions[currentQuestionIndex]?.expectedTopics && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {questions[currentQuestionIndex].expectedTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-violet-100/50 dark:bg-violet-900/30 text-xs text-violet-700 dark:text-violet-300">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className={`${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-violet-600 hover:bg-violet-700"} flex items-center gap-2 min-w-[140px]`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop ({formatTime(recordingTime)})
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
              {isRecording && (
                <div className="flex items-center gap-2">
                  <span className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Recording in progress...
                  </span>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <Textarea
                placeholder="Your answer will appear here as you speak, or you can type directly..."
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                className="min-h-[200px] bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 rounded-lg resize-none text-base leading-relaxed"
              />
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!writtenAnswer.trim() || isAnalyzing}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Submit & Continue'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Complete Interview Button */}
      {currentQuestionIndex === questions.length - 1 && (
        <div className="flex justify-end">
          <Button
            onClick={endInterview}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
          >
            Complete Interview
          </Button>
        </div>
      )}
    </div>
  );
} 