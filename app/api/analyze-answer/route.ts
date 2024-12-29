import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { generateSampleAnswer } from '@/lib/gemini';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { question, answer, jobTitle, experience } = await req.json();

    const prompt = `As a technical interviewer, analyze this ${jobTitle} interview response:

    Question: "${question}"
    Candidate's Answer: "${answer}"

    Provide a detailed analysis in this JSON format:
    {
      "aiAnswer": "Write a comprehensive answer to the question, demonstrating best practices and technical depth",
      "technicalAccuracy": [
        "List specific technical points that should be covered in the answer",
        "Include core concepts and practical applications"
      ],
      "suggestedImprovements": [
        {
          "point": "Specific area needing improvement",
          "explanation": "Detailed explanation of how to improve this aspect"
        }
      ],
      "codeExample": "If applicable, provide a code example demonstrating the concept"
    }

    Make all feedback specific to this exact question and technical topic.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json\s*|\s*```/g, '').trim();
    const feedback = JSON.parse(cleanJson);
    
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error analyzing answer:', error);
    return NextResponse.json(
      { error: 'Failed to analyze answer' },
      { status: 500 }
    );
  }
} 