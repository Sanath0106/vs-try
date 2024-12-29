'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ChallengeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateChallenge = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: 'hard',
          topic: 'problem-solving',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate challenge');
      }

      // Handle successful response
      console.log('Generated challenge:', data);
      toast({
        title: "Challenge Generated",
        description: "Your coding challenge is ready!",
      });
      
      // You can update state or trigger a callback here
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate challenge',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateChallenge}
      disabled={isLoading}
      className="bg-zinc-900 hover:bg-zinc-800"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Challenge'
      )}
    </Button>
  );
} 