import { generateQuestions } from '@/lib/gemini';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { jobTitle, jobDescription, experience } = await req.json();

    // Validate required fields
    if (!jobTitle || !experience) {
      return NextResponse.json(
        { error: 'Job title and experience are required' },
        { status: 400 }
      );
    }

    try {
      const result = await generateQuestions(jobTitle, experience, jobDescription);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Generation Error:', error);
      return NextResponse.json(
        { 
          questions: generateFallbackQuestions(jobTitle, experience),
          totalQuestions: 5
        }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Enhanced fallback questions with progression
function generateFallbackQuestions(jobTitle: string, experience: string) {
  return [
    {
      id: 1,
      text: `Can you explain the fundamental concepts of ${jobTitle.includes('Frontend') ? 'DOM manipulation and event handling' : jobTitle.includes('Backend') ? 'RESTful APIs and database design' : 'software development principles'} that you've worked with?`,
      category: "fundamental",
      difficulty: "basic",
      expectedTopics: ["core concepts", "basic principles"],
      followUpQuestions: ["Can you provide specific examples?", "How have you applied these in your work?"],
      timeEstimate: "5-7"
    },
    {
      id: 2,
      text: `Describe a challenging technical problem you've solved in your ${experience} years of experience. Walk us through your problem-solving approach.`,
      category: "intermediate",
      difficulty: "medium",
      expectedTopics: ["problem-solving", "technical analysis", "solution implementation"],
      followUpQuestions: ["What alternatives did you consider?", "How did you validate your solution?"],
      timeEstimate: "8-10"
    },
    {
      id: 3,
      text: "How do you approach performance optimization in your applications? Provide specific examples and metrics.",
      category: "advanced",
      difficulty: "medium",
      expectedTopics: ["performance optimization", "monitoring", "benchmarking"],
      followUpQuestions: ["How do you measure success?", "What tools do you use?"],
      timeEstimate: "7-9"
    },
    {
      id: 4,
      text: "Design a scalable system that handles high concurrent user requests. Consider all aspects from frontend to backend.",
      category: "system-design",
      difficulty: "hard",
      expectedTopics: ["architecture", "scalability", "performance", "security"],
      followUpQuestions: ["How would you handle failure scenarios?", "What about data consistency?"],
      timeEstimate: "10-12"
    },
    {
      id: 5,
      text: "Describe your approach to implementing and maintaining code quality in large-scale projects.",
      category: "advanced",
      difficulty: "hard",
      expectedTopics: ["code quality", "best practices", "testing strategies"],
      followUpQuestions: ["How do you ensure team compliance?", "What metrics do you track?"],
      timeEstimate: "8-10"
    }
  ];
} 