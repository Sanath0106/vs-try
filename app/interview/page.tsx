"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Video, VideoOff, MicOff, ArrowLeft } from "lucide-react";
import { PermissionsDialog } from "@/components/interview/PermissionsDialog";
import { motion } from "framer-motion";
import TypingEffect from "@/components/ui/typing-effect";

const RELAXATION_TIPS = [
  {
    title: "Deep Breathing",
    description: "Take slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.",
    icon: "🫁"
  },
  {
    title: "Power Pose",
    description: "Stand in a confident posture for 2 minutes to boost confidence.",
    icon: "💪"
  },
  {
    title: "Positive Affirmations",
    description: "Remind yourself of your achievements and capabilities.",
    icon: "✨"
  },
  {
    title: "Quick Meditation",
    description: "Take 1 minute to clear your mind and focus on the present.",
    icon: "🧘"
  }
];

const IMPROVEMENT_TIPS = [
  {
    title: "STAR Method",
    description: "Structure your answers using Situation, Task, Action, Result format.",
    icon: "⭐"
  },
  {
    title: "Active Listening",
    description: "Focus on understanding questions fully before responding.",
    icon: "👂"
  },
  {
    title: "Body Language",
    description: "Maintain good posture and natural hand gestures while speaking.",
    icon: "🧍"
  },
  {
    title: "Pause and Reflect",
    description: "Take a moment to organize your thoughts before answering.",
    icon: "⏱️"
  }
];

export default function InterviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(true);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  const jobTitle = searchParams.get("title");
  const jobDescription = searchParams.get("description");
  const experience = searchParams.get("experience");

  const startMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      setHasMediaPermissions(true);
      setIsMicOn(true);
      setIsVideoOn(true);

      const videoElement = document.getElementById('videoPreview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setHasMediaPermissions(false);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const handlePermissionsGranted = () => {
    setShowPermissionsDialog(false);
    startMediaStream();
  };

  const startInterview = () => {
    // Create a session ID (you might want to generate this from the server)
    const sessionId = Date.now().toString();
    
    // Construct the URL with all parameters
    const params = new URLSearchParams({
      title: jobTitle || "",
      description: jobDescription || "",
      experience: experience || ""
    });

    // Navigate to the interview session page
    router.push(`/interview/${sessionId}?${params.toString()}`);
  };

  const handleClosePermissions = () => {
    if (!hasMediaPermissions) {
      // If permissions aren't granted, show alert and prevent closing
      setShowPermissionsDialog(true);
      return;
    }
    setShowPermissionsDialog(false);
  };

  // Add check for media permissions
  useEffect(() => {
    if (!isMicOn && !isVideoOn && hasMediaPermissions) {
      setShowPermissionsDialog(true);
    }
  }, [isMicOn, isVideoOn, hasMediaPermissions]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-white/50 dark:hover:bg-zinc-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Interview Session
            </h1>
            <div className="w-10" />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section - Always Visible */}
            <div className="sticky top-[84px] z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl overflow-hidden relative shadow-2xl ring-1 ring-white/10">
                <video
                  id="videoPreview"
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Media Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <Button
                    variant={isMicOn ? "default" : "destructive"}
                    size="lg"
                    onClick={toggleMic}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20"
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="lg"
                    onClick={toggleVideo}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* Start Interview Button */}
              {!isInterviewStarted && hasMediaPermissions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg py-6 shadow-lg shadow-violet-500/25 rounded-xl border border-white/20"
                    size="lg"
                    onClick={startInterview}
                  >
                    <TypingEffect 
                      text="Start Interview"
                      className="font-semibold"
                    />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Tips Section - Scrollable */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Relaxation Tips */}
              <Card className="border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl h-fit">
                <div className="p-6">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Relaxation Tips
                  </h3>
                  <div className="space-y-4">
                    {RELAXATION_TIPS.map((tip, index) => (
                      <motion.div
                        key={tip.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20 text-lg">
                          {tip.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm group-hover:text-violet-600 transition-colors">
                            {tip.title}
                          </h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {tip.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Interview Tips */}
              <Card className="border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl h-fit">
                <div className="p-6">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Interview Tips
                  </h3>
                  <div className="space-y-4">
                    {IMPROVEMENT_TIPS.map((tip, index) => (
                      <motion.div
                        key={tip.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20 text-lg">
                          {tip.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm group-hover:text-violet-600 transition-colors">
                            {tip.title}
                          </h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {tip.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="hidden lg:block">
            <div className="sticky top-[84px] space-y-6">
              {/* Interview Details Card */}
              <Card className="border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      Interview Details
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-white/10">
                        <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</label>
                        <p className="text-lg font-semibold mt-1">{jobTitle}</p>
                      </div>
                      {jobDescription && (
                        <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-white/10">
                          <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Description</label>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{jobDescription}</p>
                        </div>
                      )}
                      <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-white/10">
                        <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Experience</label>
                        <p className="text-lg font-semibold mt-1">{experience} years</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-700/50 pt-6">
                    <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Interview Guidelines
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Ensure good lighting and clear audio",
                        "Speak clearly and maintain eye contact",
                        "Keep your responses concise and relevant",
                        "Take your time to think before answering"
                      ].map((guideline, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                          {guideline}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4">
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm"
                    onClick={() => window.open('https://www.youtube.com/watch?v=relaxation', '_blank')}
                  >
                    🎥 Watch Relaxation Exercise
                  </Button>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => window.open('https://www.mindtools.com/interview-tips', '_blank')}
                  >
                    📚 Read Interview Guide
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Mobile Interview Details - Only visible on mobile */}
          <div className="lg:hidden space-y-6">
            <Card className="border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Interview Details
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-white/10">
                      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</label>
                      <p className="text-lg font-semibold mt-1">{jobTitle}</p>
                    </div>
                    {jobDescription && (
                      <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-white/10">
                        <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Description</label>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{jobDescription}</p>
                      </div>
                    )}
                    <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-white/10">
                      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Experience</label>
                      <p className="text-lg font-semibold mt-1">{experience} years</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700/50 pt-6">
                  <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Interview Guidelines
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Ensure good lighting and clear audio",
                      "Speak clearly and maintain eye contact",
                      "Keep your responses concise and relevant",
                      "Take your time to think before answering"
                    ].map((guideline, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                        {guideline}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <PermissionsDialog 
        isOpen={showPermissionsDialog}
        onPermissionsGranted={handlePermissionsGranted}
        onClose={handleClosePermissions}
      />
    </div>
  );
} 