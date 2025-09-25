'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Clock } from 'lucide-react';
import type { OptimizationSuggestions as OptimizationSuggestionsType } from '@/components/thread-generator';
import { format, parseISO } from 'date-fns';

interface OptimizationSuggestionsProps {
  optimizations: OptimizationSuggestionsType;
}

export function OptimizationSuggestions({ optimizations }: OptimizationSuggestionsProps) {
  const { hook, postingTimes } = optimizations;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Compelling Hook Suggestion</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic bg-muted p-4 rounded-md">"{hook}"</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Clock className="h-5 w-5 text-primary" />
            <span>Optimal Posting Times</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {postingTimes.suggestedPostTimes.map((time, index) => (
              <p key={index} className="font-mono p-2 bg-muted rounded-md text-sm">
                {format(parseISO(time), "EEE, MMM d, yyyy 'at' h:mm a")}
              </p>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">{postingTimes.reasoning}</p>
        </CardContent>
      </Card>
    </div>
  );
}
