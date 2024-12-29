import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { answers, jobTitle, experience } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    const prompt = `As an AI interviewer, analyze this interview for a ${jobTitle} position with ${experience} years of experience requirement.

    Interview Questions and Answers:
    ${answers.map((a, i) => `
    Question ${i + 1}: ${a.questionText}
    Answer: ${a.answer}
    `).join('\n')}

    Provide a comprehensive analysis in the following JSON format:
    {
      "feedback": {
        "answers": [
          {
            "questionId": number,
            "strengths": [
              "strength point 1",
              "strength point 2"
            ],
            "improvements": [
              "improvement suggestion 1",
              "improvement suggestion 2"
            ]
          }
        ],
        "overallFeedback": {
          "rating": number (0-100),
          "positivePoints": [
            "positive point 1",
            "positive point 2"
          ],
          "improvementAreas": [
            "improvement area 1",
            "improvement area 2"
          ],
          "summary": "Overall feedback summary"
        }
      }
    }

    Ensure the feedback is:
    1. Constructive and professional
    2. Specific to the role and experience level
    3. Actionable and practical
    4. Based on industry standards
    5. Balanced between positive points and areas for improvement`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse and validate the response
      const feedback = JSON.parse(text);
      
      // Basic validation of the feedback structure
      if (!feedback.feedback || !feedback.feedback.answers || !feedback.feedback.overallFeedback) {
        throw new Error('Invalid feedback format from AI');
      }

      return NextResponse.json(feedback);
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      
      // Return a fallback response if AI fails
      return NextResponse.json({
        feedback: {
          answers: answers.map(answer => ({
            questionId: answer.questionId,
            strengths: ["Good attempt at answering the question"],
            improvements: ["Consider providing more specific examples"]
          })),
          overallFeedback: {
            rating: 70,
            positivePoints: [
              "Completed all questions",
              "Showed willingness to engage with the interview process"
            ],
            improvementAreas: [
              "Add more specific examples from your experience",
              "Elaborate on technical details where applicable"
            ],
            summary: "Overall satisfactory performance with room for improvement in specific areas."
          }
        }
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze interview' },
      { status: 500 }
    );
  }
} 