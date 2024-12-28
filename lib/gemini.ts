import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const MIN_DELAY_BETWEEN_CALLS = 15000;
let lastApiCall = 0;

// Define required skills/keywords for different roles
const roleRequirements: { [key: string]: string[] } = {
  "Frontend Developer": [
    "React", "JavaScript", "TypeScript", "HTML", "CSS", "responsive design",
    "web development", "UI/UX", "frontend frameworks"
  ],
  "Backend Developer": [
    "Node.js", "Python", "Java", "databases", "API", "server", "cloud",
    "backend development", "microservices"
  ],
  "Full Stack Developer": [
    "frontend", "backend", "database", "API", "full stack", "web development",
    "JavaScript", "React", "Node.js"
  ],
  "Data Scientist": [
    "Python", "R", "machine learning", "statistics", "data analysis",
    "SQL", "data visualization", "algorithms"
  ],
  // Add more roles as needed
};

export async function analyzeResume(resumeText: string, jobRole: string) {
  try {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCall;
    
    if (timeSinceLastCall < MIN_DELAY_BETWEEN_CALLS) {
      const waitTime = Math.ceil((MIN_DELAY_BETWEEN_CALLS - timeSinceLastCall) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before trying again.`);
    }

    // First check if resume matches role requirements
    const roleKeywords = roleRequirements[jobRole] || [];
    const foundKeywords = roleKeywords.filter(keyword => 
      resumeText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const matchPercentage = (foundKeywords.length / roleKeywords.length) * 100;
    
    if (matchPercentage < 30) {
      throw new Error(`Resume mismatch: This resume doesn't contain enough relevant skills for a ${jobRole} position. Found only ${Math.round(matchPercentage)}% of expected keywords.`);
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const analysisPrompt = `
      As an ATS (Applicant Tracking System) expert, analyze this resume for a ${jobRole} position.
      Focus on ATS compatibility and keyword optimization. Provide a concise response in this exact format:

      SCORE: [Score 0-100 based on ATS compatibility and role relevance]

      STRENGTHS:
      • [Key strength with focus on ATS-friendly aspects]
      • [Another strength related to role requirements]
      • [Final key strength highlighting unique qualifications]

      IMPROVEMENTS:
      • [Specific ATS optimization suggestion]
      • [Keyword placement improvement]
      • [Format or structure improvement]

      KEYWORDS: [List exactly 5 most important keywords found, prioritizing role-specific technical skills]

      ATS RECOMMENDATIONS:
      • [Specific ATS formatting suggestion]
      • [Keyword optimization tip]
      • [Structure improvement for better ATS scanning]

      Resume text: ${resumeText}
    `;

    const result = await model.generateContent(analysisPrompt);
    
    if (!result || !result.response) {
      throw new Error("Failed to get response from AI");
    }

    lastApiCall = Date.now();
    const text = result.response.text();

    const analysis = {
      score: extractScore(text),
      strengths: extractStrengths(text),
      improvements: extractImprovements(text),
      keywords: extractKeywords(text).slice(0, 5),
      aiSuggestions: extractATSSuggestions(text),
    };

    // Validate the analysis
    if (!analysis.score || 
        analysis.strengths.length === 0 || 
        analysis.improvements.length === 0 ||
        analysis.keywords.length === 0) {
      throw new Error("Invalid analysis: Could not properly analyze the resume");
    }

    return analysis;

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

function extractScore(text: string): number {
  const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
  return scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : 0;
}

function extractStrengths(text: string): string[] {
  const section = text.match(/STRENGTHS:(.*?)(?=IMPROVEMENTS:|$)/is);
  if (!section) return [];
  
  return section[1]
    .split(/[•\-\*]/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.includes('Key strength'))
    .slice(0, 3);
}

function extractImprovements(text: string): string[] {
  const section = text.match(/IMPROVEMENTS:(.*?)(?=KEYWORDS:|$)/is);
  if (!section) return [];
  
  return section[1]
    .split(/[•\-\*]/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.includes('Improvement'))
    .slice(0, 3);
}

function extractKeywords(text: string): string[] {
  const section = text.match(/KEYWORDS:(.*?)(?=ATS RECOMMENDATIONS:|$)/is);
  if (!section) return [];
  
  return section[1]
    .split(/[,\n]/)
    .map(keyword => keyword.trim())
    .filter(keyword => 
      keyword.length > 0 && 
      !keyword.includes('[') && 
      !keyword.includes(']')
    )
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 5); // Ensure maximum of 5 keywords
}

function extractATSSuggestions(text: string): string[] {
  const section = text.match(/ATS RECOMMENDATIONS:(.*?)$/is);
  if (!section) return [];
  
  return section[1]
    .split(/[•\-\*]/)
    .map(line => line.trim())
    .filter(line => 
      line.length > 0 && 
      !line.includes('suggestion') &&
      line.toLowerCase().includes('ats')
    )
    .slice(0, 3);
}

export async function generateBuggyCode(
  topic: string, 
  difficulty: string,
  language: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `
    Generate a programming challenge based on these exact specifications:
    Topic: ${topic}
    Programming Language: ${language}
    Difficulty Level: ${difficulty}

    Create a problem that specifically tests ${topic} concepts in ${language}.
    For ${difficulty} difficulty, the bugs should be ${
      difficulty === 'easy' ? 'straightforward and obvious' :
      difficulty === 'medium' ? 'moderately challenging to spot' :
      'subtle and complex'
    }.

    Return a JSON object with this structure:
    {
      "description": "A clear problem statement about ${topic}",
      "buggyCode": "function example() {\\n  // Original buggy implementation without explanatory comments\\n}",
      "correctCode": "// SOLUTION with marked changes\\n\\nfunction example() {\\n  // [FIXED] Original line: buggy code here\\n  // [CHANGED] New corrected line with explanation\\n  // [ADDED] New line that was missing\\n  // [REMOVED] Removed problematic line\\n}\\n\\n/* Changes Made:\\n 1. Fixed comparison operator in line X\\n 2. Added missing check for edge case\\n 3. Removed redundant code\\n */",
      "hints": [
        "Specific hint about the ${topic}-related bug",
        "Hint about common ${topic} mistakes",
        "Hint about the solution approach"
      ],
      "testCases": [
        {
          "input": "Example input for this ${topic} problem",
          "expectedOutput": "Expected result after fixing the bug"
        }
      ],
      "bugExplanation": "Line-by-line explanation of changes made to fix the bugs:\\n1. Line X: Changed Y to Z because...\\n2. Line A: Added check for B to prevent..."
    }

    Requirements:
    1. buggyCode should be clean without comments
    2. correctCode must mark EVERY change with [FIXED], [CHANGED], [ADDED], or [REMOVED] comments
    3. Include a summary of all changes at the bottom of correctCode
    4. Code MUST be in ${language} syntax
    5. Bugs MUST be related to ${topic} concepts
    6. Changes must be clearly explained line by line
    7. All code must be complete and runnable
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = await result.response.text();
    
    // Clean the response
    response = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/`/g, '"')
      .replace(/\r/g, '')
      .trim();

    // Extract JSON object
    const jsonMatch = response.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      console.error('Raw response:', response);
      throw new Error('No JSON object found in response');
    }

    // Clean the JSON string more thoroughly
    let cleanJson = jsonMatch[1]
      .replace(/[\n\r]/g, '')         // Remove all newlines
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .replace(/\\n/g, '\\n')         // Preserve intended newlines
      .replace(/\\'/g, "'")           // Fix single quotes
      .replace(/\t/g, '\\t')          // Handle tabs
      .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')  // Ensure property names are quoted
      .replace(/:\s*'([^']*)'/g, ':"$1"')  // Convert single quoted values to double quotes
      .replace(/,\s*}/g, '}')         // Remove trailing commas
      .replace(/,\s*]/g, ']')         // Remove trailing commas in arrays
      .trim();

    try {
      const parsed = JSON.parse(cleanJson);

      // Validate required fields
      const requiredFields = ['description', 'buggyCode', 'correctCode', 'hints', 'testCases', 'bugExplanation'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // More flexible validation for hints
      if (!Array.isArray(parsed.hints)) {
        throw new Error('Hints must be an array');
      }
      
      // Ensure we have at least one hint, but not requiring exactly 3
      if (parsed.hints.length === 0) {
        throw new Error('At least one hint is required');
      }

      // Ensure hints are strings
      if (!parsed.hints.every(hint => typeof hint === 'string')) {
        throw new Error('All hints must be strings');
      }

      // Validate test cases
      if (!Array.isArray(parsed.testCases) || parsed.testCases.length === 0) {
        throw new Error('At least one test case is required');
      }

      // If we have less than 3 hints, pad the array
      while (parsed.hints.length < 3) {
        parsed.hints.push("Try reviewing the code carefully");
      }

      return parsed;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Attempted to parse:', cleanJson);
      throw new Error('Invalid challenge format received');
    }
  } catch (error: any) {
    console.error('Error generating buggy code:', error);
    throw new Error(
      error.message === 'No JSON object found in response'
        ? 'Failed to generate valid challenge format'
        : 'Failed to generate challenge. Please try again.'
    );
  }
} 