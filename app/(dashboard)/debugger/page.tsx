"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CodeEditor from "@/components/CodeEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  Code2,
  Lightbulb,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Eye,
} from "lucide-react";
import { generateBuggyCode } from "@/lib/gemini";
import { toast } from "@/components/ui/use-toast";

const PROGRAMMING_LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "TypeScript", value: "typescript" },
  { label: "Ruby", value: "ruby" },
] as const;

interface Challenge {
  topic: string;
  difficulty: string;
  language: string;
  buggyCode: string;
  correctCode: string;
  hints: string[];
  description: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  bugExplanation: string;
}

const DSA_TOPICS = [
  "Arrays",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Trees",
  "Graphs",
  "Sorting",
  "Searching",
  "Dynamic Programming",
  "Recursion",
];

const DIFFICULTY_LEVELS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export default function DebuggerPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    output?: string;
    error?: string;
  } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [showSolution, setShowSolution] = useState(false);

  const validateSelections = () => {
    const errors = [];
    
    if (!selectedTopic) {
      errors.push("Select a topic");
    }
    if (!selectedLanguage) {
      errors.push("Select a programming language");
    }
    if (!difficulty) {
      errors.push("Select difficulty level");
    }

    return errors;
  };

  const generateChallenge = async () => {
    const validationErrors = validateSelections();
    
    if (validationErrors.length > 0) {
      toast({
        title: "Missing Selections",
        description: (
          <div className="space-y-2">
            <p>Please complete all selections:</p>
            <ul className="list-disc pl-4 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const newChallenge = await generateBuggyCode(selectedTopic, difficulty, selectedLanguage);
      setChallenge(newChallenge);
      setUserCode(newChallenge.buggyCode);
      setShowHint(false);
      setCurrentHintIndex(0);
      setTestResults(null);
      setShowSolution(false);
      
      toast({
        title: "Challenge Generated",
        description: "Your debugging challenge is ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const runCode = async () => {
    if (!challenge) return;

    setIsRunning(true);
    try {
      // Here you would typically send the code to a backend service
      // for execution and testing. For now, we'll simulate it:
      const passed = userCode.includes(challenge.correctCode);
      setTestResults({
        passed,
        output: passed ? "All test cases passed!" : "Test cases failed",
      });
    } catch (error: any) {
      setTestResults({
        passed: false,
        error: error.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const showNextHint = () => {
    if (!challenge || currentHintIndex >= challenge.hints.length - 1) return;
    setCurrentHintIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Code Debugger Challenge
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Debug the buggy code and improve your problem-solving skills
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Controls */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedTopic}
                onValueChange={setSelectedTopic}
              >
                <SelectTrigger 
                  className={`w-full sm:w-[200px] ${!selectedTopic && 'border-red-200 dark:border-red-800'}`}
                >
                  <SelectValue placeholder="Select Topic *" />
                </SelectTrigger>
                <SelectContent>
                  {DSA_TOPICS.map(topic => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger 
                  className={`w-full sm:w-[200px] ${!selectedLanguage && 'border-red-200 dark:border-red-800'}`}
                >
                  <SelectValue placeholder="Select Language *" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMMING_LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={difficulty}
                onValueChange={setDifficulty}
              >
                <SelectTrigger 
                  className={`w-full sm:w-[200px] ${!difficulty && 'border-red-200 dark:border-red-800'}`}
                >
                  <SelectValue placeholder="Select Difficulty *" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full sm:w-auto"
                onClick={generateChallenge}
                disabled={isGenerating || !selectedTopic || !selectedLanguage || !difficulty}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Challenge
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Code Editor */}
          {challenge && (
            <>
              <Card className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Debug This Code</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {challenge.description}
                  </p>
                </div>
                <div className="mb-4">
                  <CodeEditor
                    value={userCode}
                    onChange={setUserCode}
                    language={selectedLanguage}
                    theme="vs-dark"
                    height="400px"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1"
                    onClick={runCode}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Solution Section - Moved here */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Code2 className="w-5 h-5 mr-2 text-emerald-500" />
                  Solution
                </h3>
                {showSolution ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                          Original Code with Issues:
                        </h4>
                        <CodeEditor
                          value={challenge.buggyCode}
                          language={selectedLanguage}
                          theme="vs-dark"
                          height="200px"
                          readOnly={true}
                        />
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                          Corrected Code with Explanations:
                        </h4>
                        <CodeEditor
                          value={`/*
 * PROBLEM IDENTIFIED:
 * ${challenge.bugExplanation}
 *
 * FIXES MADE:
 * ${challenge.hints.map((hint, i) => `${i + 1}. ${hint}`).join('\n * ')}
 */

${challenge.correctCode}

/*
 * TEST CASE EXAMPLE:
 * Input: ${challenge.testCases[0].input}
 * Expected Output: ${challenge.testCases[0].expectedOutput}
 */`}
                          language={selectedLanguage}
                          theme="vs-dark"
                          height="300px"
                          readOnly={true}
                        />
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                          Step-by-Step Explanation:
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-emerald-100/50 dark:bg-emerald-900/30 rounded-lg p-3">
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                              {challenge.bugExplanation}
                            </p>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                              Key Points to Remember:
                            </h5>
                            <ul className="space-y-2">
                              {challenge.hints.map((hint, index) => (
                                <li 
                                  key={index}
                                  className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start"
                                >
                                  <span className="mr-2">•</span>
                                  {hint}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowSolution(false)}
                    >
                      Hide Solution
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Need help? View the solution after attempting the challenge.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      onClick={() => {
                        setShowSolution(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Solution
                    </Button>
                  </div>
                )}
              </Card>

              {/* Test Results */}
              {testResults && (
                <Card className={`p-6 ${testResults.passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <h3 className="text-lg font-semibold mb-2">
                    Test Results
                  </h3>
                  {testResults.error ? (
                    <pre className="text-red-600 dark:text-red-400 text-sm p-4 bg-red-50 dark:bg-red-900/40 rounded-lg">
                      {testResults.error}
                    </pre>
                  ) : (
                    <div className={`text-sm ${testResults.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {testResults.output}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Now only contains Challenge Info and Hints */}
        {challenge && (
          <div className="space-y-6">
            {/* Challenge Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Code2 className="w-5 h-5 mr-2 text-violet-500" />
                Challenge Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Topic
                  </p>
                  <Badge variant="secondary">
                    {selectedTopic}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Language
                  </p>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {PROGRAMMING_LANGUAGES.find(lang => lang.value === selectedLanguage)?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Difficulty
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      difficulty === 'easy' ? 'text-green-600 border-green-600' :
                      difficulty === 'medium' ? 'text-yellow-600 border-yellow-600' :
                      'text-red-600 border-red-600'
                    }
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Hints */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Hints
              </h3>
              {showHint ? (
                <div className="space-y-4">
                  {challenge.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <div
                      key={index}
                      className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {hint}
                      </p>
                    </div>
                  ))}
                  {currentHintIndex < challenge.hints.length - 1 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={showNextHint}
                    >
                      Show Next Hint
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowHint(true)}
                >
                  Show Hints
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 