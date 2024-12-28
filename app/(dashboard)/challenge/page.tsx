"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Code, Timer } from "lucide-react";

// Daily LeetCode challenge data
const dailyChallenge = {
  title: "Two Sum",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
  link: "https://leetcode.com/problems/two-sum/",
  resetTime: new Date(new Date().setHours(24, 0, 0, 0)), // Next midnight
};

export default function ChallengePage() {
  const [timeLeft, setTimeLeft] = useState("");

  // Timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = dailyChallenge.resetTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        return "00:00:00";
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Daily Coding Challenge
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Resets in {timeLeft}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                <Code className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{dailyChallenge.title}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Difficulty: {dailyChallenge.difficulty}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Category: {dailyChallenge.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-zinc-400" />
              <span className="text-sm font-mono">{timeLeft}</span>
            </div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {dailyChallenge.description}
          </p>

          <Button
            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity"
            onClick={() => window.open(dailyChallenge.link, '_blank')}
          >
            Solve Challenge
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
} 