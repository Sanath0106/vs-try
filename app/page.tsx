"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "AI-Powered Practice",
    description: "Get realistic interview practice with Gemini AI technology",
    icon: "/icons/ai-robot.svg",
    gradient: "from-violet-500 to-indigo-500",
    delay: 0,
  },
  {
    title: "Instant Feedback",
    description: "Receive detailed feedback and improvement suggestions",
    icon: "/icons/feedback.svg",
    gradient: "from-indigo-500 to-purple-500",
    delay: 0.1,
  },
  {
    title: "Flexible Scheduling",
    description: "Practice anytime, anywhere at your convenience",
    icon: "/icons/calendar.svg",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    title: "Industry Specific",
    description: "Tailored questions for your industry and role",
    icon: "/icons/target.svg",
    gradient: "from-pink-500 to-violet-500",
    delay: 0.3,
  },
];

const quotes = [
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Preparation is the key to confidence.",
    author: "Anonymous"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    quote: "Every expert was once a beginner.",
    author: "Helen Hayes"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    quote: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    quote: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  }
];

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Enhanced Header */}
      <header className="fixed w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Nexus
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">AI Interview Coach</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                How it Works
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                Contact
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="text-sm bg-violet-600 hover:bg-violet-700">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
              <nav className="flex flex-col space-y-4">
                <a href="#features" 
                  className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a href="#how-it-works" 
                  className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </a>
                <a href="#contact" 
                  className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="pt-4 flex flex-col space-y-2 px-4">
                  <Link href="/sign-in" className="w-full">
                    <Button variant="ghost" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 justify-center">Sign Up</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Visual */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/50 bg-[size:32px_32px] opacity-20" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6 tracking-tight">
                Master Your Interviews with AI
              </h1>
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 mb-8 max-w-2xl lg:max-w-none mx-auto">
                Practice interviews with Gemini AI and boost your confidence. Get instant feedback and improve your interview skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:opacity-90 transition-opacity text-lg px-8"
                  onClick={() => router.push('/sign-up')}
                >
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-20 blur-3xl rounded-3xl" />
              <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-4 sm:p-8">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-700">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2 text-sm font-medium">Interview Session</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 p-4">
                      <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-violet-600 flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                            <p className="text-sm font-medium">You</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-600 flex items-center justify-center">
                              <span className="text-2xl">🤖</span>
                            </div>
                            <p className="text-sm font-medium">AI Interviewer</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                      <div className="flex justify-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <span>🎤</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <span>📹</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                          <span>✋</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">AI Ready</span>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Practice Session #1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Journey to Interview Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Choose Your Path
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 flex-grow">
                  Select your industry and role to get tailored interview questions and personalized guidance
                </p>
              </div>
            </div>

            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Practice with AI
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 flex-grow">
                  Engage in natural conversations with our AI interviewer and build your confidence
                </p>
              </div>
            </div>

            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Get Insights
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 flex-grow">
                  Receive detailed feedback on your responses, body language, and areas for improvement
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:opacity-90 transition-opacity text-lg px-8">
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Quotes Section - Seamlessly integrated */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.7,
                ease: "easeInOut"
              }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-light italic text-zinc-700 dark:text-zinc-300 mb-4">
                "{quotes[currentQuote].quote}"
              </p>
              <p className="text-lg md:text-xl font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                — {quotes[currentQuote].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Why Choose Nexus
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Experience the future of interview preparation with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="relative group"
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r opacity-25 blur-lg transition-all duration-500 group-hover:opacity-75 group-hover:blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--${feature.gradient}))`
                  }}
                />
                <div className="relative bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 h-full flex flex-col items-center text-center transition-transform duration-300 group-hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <div className="w-8 h-8 text-white">
          <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={32}
                        height={32}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Elements */}
          <div className="absolute -z-10 blur-3xl opacity-20 dark:opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply animate-blob" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply animate-blob animation-delay-4000" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-zinc-50/50 dark:bg-zinc-900/50 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Nexus
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Empowering careers through AI-powered interview practice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-600 p-0 h-auto">Home</Button></li>
                <li><Button variant="link" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-600 p-0 h-auto">Features</Button></li>
                <li><Button variant="link" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-600 p-0 h-auto">Inspiration</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
                <li>Email: hello@nexus.ai</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-600">Twitter</Button>
                <Button variant="ghost" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-600">LinkedIn</Button>
                <Button variant="ghost" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-600">Instagram</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-600 dark:text-zinc-300">
            © 2024 Nexus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
