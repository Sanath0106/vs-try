"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Code, Target, Timer } from "lucide-react";

const stats = [
  { label: "Practice Sessions", value: "12" },
  { label: "Hours Practiced", value: "8.5" },
  { label: "Questions Mastered", value: "48" },
  { label: "Success Rate", value: "85%" },
];

const upcomingTopics = [
  {
    topic: "System Design",
    description: "Learn about scalability, load balancing, and caching",
    icon: Brain,
    progress: 65,
  },
  {
    topic: "Data Structures",
    description: "Master arrays, linked lists, trees, and graphs",
    icon: Code,
    progress: 80,
  },
  {
    topic: "Behavioral",
    description: "Practice STAR method responses and leadership examples",
    icon: Target,
    progress: 45,
  },
];

const studyTips = [
  {
    title: "System Design Preparation",
    tips: [
      "Study distributed systems concepts",
      "Practice drawing system architectures",
      "Understand CAP theorem",
      "Learn about database scaling",
    ],
  },
  {
    title: "Coding Interview Tips",
    tips: [
      "Think aloud while solving problems",
      "Start with brute force approach",
      "Optimize solution step by step",
      "Test your code with edge cases",
    ],
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Track your progress and prepare for your upcoming interviews.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 text-center hover:border-violet-500/50 transition-colors">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Topic Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            <div className="space-y-6">
              {upcomingTopics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                        <topic.icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{topic.topic}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{topic.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{topic.progress}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Study Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Interview Preparation Tips</h2>
            <div className="space-y-6">
              {studyTips.map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-violet-600" />
                    <span>{section.title}</span>
                  </h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <span className="text-violet-600 dark:text-violet-400">•</span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Interview Practice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Next Practice?</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl">
              Start a simulated interview with our AI interviewer. Choose your industry and role to get
              tailored questions and real-time feedback.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity"
            >
              Start Interview Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 