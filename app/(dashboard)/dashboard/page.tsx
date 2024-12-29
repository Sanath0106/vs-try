"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Brain, Target, RefreshCw } from "lucide-react";
import Link from "next/link";
import { fetchTechNews, fetchTechJobs, NewsItem, JobItem } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns';
import { InterviewDialog } from "@/components/interview/InterviewDialog";

// Add the stats data
const stats = [
  { label: "Practice Sessions", value: "12" },
  { label: "Hours Practiced", value: "8.5" },
  { label: "Questions Mastered", value: "48" },
  { label: "Success Rate", value: "85%" },
];

export default function DashboardPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);

  // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [newsData, jobsData] = await Promise.all([
        fetchTechNews(),
        fetchTechJobs()
      ]);
      
      if (newsData.length === 0 && jobsData.length === 0) {
        throw new Error('No data available');
      }
      
      setNews(newsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // You could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="grid md:grid-cols-2 gap-4 lg:gap-8 mb-8">
        {/* Tech News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Latest in Tech</h2>
              <Button 
                variant="ghost" 
                className="text-xs sm:text-sm text-violet-600 hover:text-violet-700"
                onClick={() => window.open('https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB', '_blank')}
              >
                View All
              </Button>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {news.map((item, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors p-2" 
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {item.urlToImage && (
                        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                          <img 
                            src={item.urlToImage} 
                            alt={item.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 truncate max-w-[150px]">
                            {item.source.name}
                          </span>
                          <span className="text-xs text-zinc-500 shrink-0">
                            {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                          </span>
                        </div>
                        <h3 className="font-semibold group-hover:text-violet-600 transition-colors line-clamp-2 text-sm sm:text-base">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Job Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Job Opportunities</h2>
              <Button 
                variant="ghost" 
                className="text-xs sm:text-sm text-violet-600 hover:text-violet-700"
                onClick={() => window.open('https://www.linkedin.com/jobs/', '_blank')}
              >
                View All
              </Button>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors p-2" 
                    onClick={() => window.open(job.url, '_blank')}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="shrink-0 w-12 h-12 rounded overflow-hidden hidden sm:block">
                        <img 
                          src={job.company_logo} 
                          alt={`${job.company} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1 sm:mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            {job.type}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <h3 className="font-semibold group-hover:text-violet-600 transition-colors text-sm sm:text-base">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                          {job.company}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {job.location}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Interview Practice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10" />
          <div className="relative p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Next Practice?</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl">
              Start a simulated interview with our AI interviewer. Choose your industry and role to get
              tailored questions and real-time feedback.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity"
              onClick={() => setIsInterviewDialogOpen(true)}
            >
              Start Interview Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>

      <InterviewDialog 
        isOpen={isInterviewDialogOpen}
        onClose={() => setIsInterviewDialogOpen(false)}
      />
    </div>
  );
} 