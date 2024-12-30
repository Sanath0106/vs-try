"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import InterviewQuestions from "@/components/interview/InterviewQuestions";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Clock, Briefcase, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewSessionPage() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("title") || "";
  const jobDescription = searchParams.get("description") || "";
  const experience = searchParams.get("experience") || "";

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    startMediaStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);

      const videoElement = document.getElementById('videoPreview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = mediaStream;
        videoElement.muted = true;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsVideoOn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-violet-600"
      >
        Skip to main content
      </a>

      {/* Header with better accessibility */}
      <header role="banner" className="sticky top-0 z-50 border-b border-violet-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                  Technical Interview
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {jobTitle} Position
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{experience} Years Required</span>
              </div>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Technical Assessment</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with ARIA landmarks */}
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Questions Section */}
          <section 
            aria-label="Interview Questions"
            className="order-2 lg:order-1"
          >
            <Card className="overflow-hidden border-2 border-violet-500/10 dark:border-violet-500/5 shadow-xl shadow-violet-500/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <div className="p-4 border-b border-violet-100 dark:border-zinc-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Interview Questions
                  </h2>
                  <span className="text-sm text-violet-600 dark:text-violet-400">
                    AI-Powered Interview
                  </span>
                </div>
              </div>
              <div className="p-6">
                <InterviewQuestions 
                  jobTitle={jobTitle}
                  jobDescription={jobDescription}
                  experience={experience}
                />
              </div>
            </Card>
          </section>

          {/* Video Section */}
          <aside 
            aria-label="Video Preview and Interview Details"
            className="order-1 lg:order-2"
          >
            {/* Video Controls */}
            <div className="sticky top-24 space-y-6">
              <Card className="overflow-hidden border-2 border-violet-500/10 dark:border-violet-500/5 shadow-xl shadow-violet-500/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                <div className="p-4 border-b border-violet-100 dark:border-zinc-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Video Preview
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200">
                      Live
                    </span>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 relative">
                  <video
                    id="videoPreview"
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror-mode"
                  />

                  {/* Video Disabled Overlay */}
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                          <VideoOff className="h-6 w-6 text-zinc-400" />
                        </div>
                        <p className="text-sm text-zinc-400">
                          Camera is disabled
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Interview Details */}
              <Card className="overflow-hidden border-2 border-violet-500/10 dark:border-violet-500/5 shadow-xl shadow-violet-500/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                <div className="p-4 border-b border-violet-100 dark:border-zinc-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Interview Details
                    </h2>
                    <FileText className="h-4 w-4 text-violet-500" />
                  </div>
                </div>
                <div className="divide-y divide-violet-100 dark:divide-zinc-800">
                  <div className="p-4">
                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Position
                    </label>
                    <p className="mt-1 text-zinc-800 dark:text-zinc-200 font-medium">
                      {jobTitle}
                    </p>
                  </div>
                  <div className="p-4">
                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Experience Required
                    </label>
                    <p className="mt-1 text-zinc-800 dark:text-zinc-200 font-medium">
                      {experience} years
                    </p>
                  </div>
                  {jobDescription && (
                    <div className="p-4">
                      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Job Description
                      </label>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4">
                        {jobDescription}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
} 