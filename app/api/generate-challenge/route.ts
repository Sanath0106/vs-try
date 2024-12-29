import { generateChallenge } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { difficulty, topic } = await req.json();
    
    if (!difficulty || !topic) {
      return NextResponse.json(
        { error: 'Difficulty and topic are required' },
        { status: 400 }
      );
    }

    try {
      const challenge = await generateChallenge(difficulty, topic);
      return NextResponse.json(challenge);
    } catch (genError) {
      console.error('Generation Error:', genError);
      return NextResponse.json(
        { error: 'Failed to generate challenge' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
} 