"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart,
  Download,
  RefreshCw,
  Briefcase,
  Bot,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { analyzeResume } from "@/lib/gemini";
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  aiSuggestions: string[];
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: "",
    description: "",
  });

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    
    if (!uploadedFile) return;

    if (!allowedFileTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
  };

  const analyzeResumeWithAI = async () => {
    if (!file || !jobRole) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and specify the job role",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const text = await readFileContent(file);
      
      if (text.length < 100) {
        setErrorDialog({
          open: true,
          title: "Invalid Resume",
          description: "The resume content appears to be too short or empty. Please upload a valid resume.",
        });
        return;
      }

      const result = await analyzeResume(text, jobRole);
      setAnalysis(result);
      
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to analyze resume";
      
      if (errorMessage.includes("rate limit")) {
        setErrorDialog({
          open: true,
          title: "Service Temporarily Unavailable",
          description: "We've reached our API limit. Please try again in a few minutes.",
        });
      } else if (errorMessage.includes("Resume mismatch")) {
        setErrorDialog({
          open: true,
          title: "Resume Mismatch",
          description: errorMessage.replace("Resume mismatch: ", ""),
        });
      } else {
        setErrorDialog({
          open: true,
          title: "Error",
          description: errorMessage || "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to read file content
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Basic text cleanup
        const cleanedText = text
          .replace(/[\r\n]+/g, '\n')  // Normalize line endings
          .replace(/\s+/g, ' ')       // Normalize whitespace
          .trim();
        resolve(cleanedText);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const downloadReport = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 10;
    let yPos = margin;

    // Add border to the page
    doc.setDrawColor(90, 49, 196); // violet-600
    doc.setLineWidth(0.5);
    doc.rect(margin/2, margin/2, pageWidth - margin, pageHeight - margin);

    // Add header with logo/trademark
    doc.setFillColor(90, 49, 196);
    doc.rect(margin/2, margin/2, pageWidth - margin, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('ResumeAI', margin, yPos + 16);
    
    // Add trademark text
    doc.setFontSize(10);
    doc.text('Powered by AI Resume Analysis', pageWidth - margin - 50, yPos + 16);
    
    yPos += 35; // Move past header

    // Title and Job Role
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('Resume Analysis Report', margin, yPos);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Job Role: ${jobRole}`, margin, yPos + 10);
    yPos += lineHeight * 3;

    // Score section with background
    doc.setFillColor(245, 245, 255); // Light purple background
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 20, 'F');
    doc.setTextColor(90, 49, 196);
    doc.setFontSize(16);
    doc.text(`Overall Score: ${analysis.score}/100`, margin + 5, yPos + 8);
    yPos += lineHeight * 3;

    // Section styling function
    const addSection = (title: string, content: string[], icon: string) => {
      // Section title with icon
      doc.setFillColor(250, 250, 255);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 15, 'F');
      doc.setTextColor(90, 49, 196);
      doc.setFontSize(14);
      doc.text(`${icon} ${title}`, margin + 5, yPos + 5);
      yPos += lineHeight * 1.5;

      // Content
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      content.forEach(item => {
        // Check if text will overflow page
        if (yPos > pageHeight - margin * 2) {
          doc.addPage();
          yPos = margin;
          // Add border to new page
          doc.setDrawColor(90, 49, 196);
          doc.setLineWidth(0.5);
          doc.rect(margin/2, margin/2, pageWidth - margin, pageHeight - margin);
        }
        
        const lines = doc.splitTextToSize(`• ${item}`, pageWidth - (margin * 2) - 10);
        lines.forEach((line: string) => {
          doc.text(line, margin + 5, yPos);
          yPos += lineHeight;
        });
      });
      yPos += lineHeight;
    };

    // Add each section
    addSection('Strengths', analysis.strengths, '✓');
    addSection('Areas for Improvement', analysis.improvements, '!');
    
    // Keywords section
    doc.setFillColor(250, 250, 255);
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 15, 'F');
    doc.setTextColor(90, 49, 196);
    doc.setFontSize(14);
    doc.text('⌘ Top Keywords Found', margin + 5, yPos + 5);
    yPos += lineHeight * 1.5;

    // Keywords as badges
    doc.setFontSize(11);
    let xPos = margin + 5;
    analysis.keywords.forEach(keyword => {
      const keywordWidth = doc.getTextWidth(keyword) + 10;
      if (xPos + keywordWidth > pageWidth - margin) {
        xPos = margin + 5;
        yPos += lineHeight * 1.5;
      }
      
      // Draw keyword badge
      doc.setFillColor(245, 245, 255);
      doc.roundedRect(xPos, yPos - 5, keywordWidth, 15, 2, 2, 'F');
      doc.setTextColor(90, 49, 196);
      doc.text(keyword, xPos + 5, yPos + 4);
      xPos += keywordWidth + 5;
    });
    yPos += lineHeight * 3;

    addSection('ATS Optimization Tips', analysis.aiSuggestions, '★');

    // Add footer
    const footer = 'Generated by ResumeAI - www.resumeai.com';
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(footer, pageWidth/2, pageHeight - 10, { align: 'center' });

    // Add date
    const date = new Date().toLocaleDateString();
    doc.text(date, margin, pageHeight - 10);

    // Save the PDF
    doc.save('resume-analysis.pdf');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Resume Analysis
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Upload your resume and get AI-powered feedback and suggestions
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>

            {/* Job Role Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Target Job Role
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., Frontend Developer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="flex-1"
                />
                <Briefcase className="h-5 w-5 text-zinc-400 self-center" />
              </div>
            </div>

            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-zinc-400 mb-4" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Drag and drop your resume here or click to browse
                </p>
                <p className="text-xs text-zinc-500">Maximum file size: 5MB</p>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
              disabled={!file || !jobRole || isAnalyzing}
              onClick={analyzeResumeWithAI}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Progress value={analysis.score} className="h-2" />
                  </div>
                  <span className="text-2xl font-bold text-violet-600">
                    {analysis.score}/100
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span>•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span>•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keywords */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <BarChart className="h-5 w-5 text-violet-500 mr-2" />
                    Top Keywords Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500 mt-2">
                    These are the top 5 most relevant keywords found in your resume
                  </p>
                </div>

                {/* AI Suggestions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Bot className="h-5 w-5 text-blue-500 mr-2" />
                    ATS Optimization Tips
                  </h3>
                  <ul className="space-y-2">
                    {analysis.aiSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="text-blue-500">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-zinc-500 mt-2">
                    Follow these suggestions to improve your resume's ATS compatibility
                  </p>
                </div>

                <Button className="w-full" variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Detailed Report
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <Dialog
        open={errorDialog.open}
        onOpenChange={(open) => 
          setErrorDialog(prev => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {errorDialog.title}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {errorDialog.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
} 