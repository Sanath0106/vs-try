"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

const QuizContent = dynamic(
  () => import('./QuizContent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    ),
  }
);

export default function QuizWrapper() {
  return <QuizContent />;
} 