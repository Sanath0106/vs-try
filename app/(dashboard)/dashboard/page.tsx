"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Code, Target, Timer, Bug, Clock, Trophy, RefreshCw, Lightbulb } from "lucide-react";
import Link from "next/link";

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

const techNews = [
  {
    title: "OpenAI Releases GPT-5",
    description: "Latest breakthrough in AI technology with enhanced capabilities",
    source: "TechCrunch",
    date: "2h ago",
    tag: "AI News",
    link: "#"
  },
  {
    title: "Microsoft Announces New Developer Tools",
    description: "New suite of AI-powered development tools for cloud computing",
    source: "The Verge",
    date: "4h ago",
    tag: "Dev Tools",
    link: "#"
  },
  {
    title: "Top Tech Trends 2024",
    description: "AI, Quantum Computing, and Web3 lead the way",
    source: "WIRED",
    date: "1d ago",
    tag: "Trends",
    link: "#"
  }
];

const jobOpportunities = [
  {
    role: "Software Engineer Intern",
    company: "Google",
    location: "Remote / Mountain View, CA",
    type: "Internship",
    posted: "2d ago",
    link: "#"
  },
  {
    role: "Junior Frontend Developer",
    company: "Meta",
    location: "Remote / New York",
    type: "Full-time",
    posted: "1d ago",
    link: "#"
  },
  {
    role: "ML Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "3d ago",
    link: "#"
  }
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

      {/* Tech News and Job Opportunities */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Tech News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest in Tech</h2>
              <Button variant="ghost" className="text-sm text-violet-600 hover:text-violet-700">
                View All
              </Button>
            </div>
            <div className="space-y-6">
              {techNews.map((news, index) => (
                <div key={index} className="group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                          {news.tag}
                        </span>
                        <span className="text-xs text-zinc-500">{news.date}</span>
                      </div>
                      <h3 className="font-semibold group-hover:text-violet-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {news.description}
                      </p>
                      <p className="text-xs text-zinc-500">Source: {news.source}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Job Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Job Opportunities</h2>
              <Button variant="ghost" className="text-sm text-violet-600 hover:text-violet-700">
                View All
              </Button>
            </div>
            <div className="space-y-6">
              {jobOpportunities.map((job, index) => (
                <div key={index} className="group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                          {job.type}
                        </span>
                        <span className="text-xs text-zinc-500">{job.posted}</span>
                      </div>
                      <h3 className="font-semibold group-hover:text-violet-600 transition-colors">
                        {job.role}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {job.company}
                      </p>
                      <p className="text-xs text-zinc-500">{job.location}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
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