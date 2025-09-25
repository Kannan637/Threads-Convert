'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThreadPreview } from '@/components/thread-preview';
import { OptimizationSuggestions as OptimizationSuggestionsComponent } from '@/components/optimization-suggestions';
import type { GeneratedThread, OptimizationSuggestions } from '@/components/thread-generator';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';

interface ResultsPanelProps {
  generatedThread: GeneratedThread | null;
  setGeneratedThread: React.Dispatch<React.SetStateAction<GeneratedThread | null>>;
  optimizations: OptimizationSuggestions | null;
  isLoading: boolean;
  loadingMessage: string;
  platform: 'Twitter' | 'LinkedIn';
}

export function ResultsPanel({ generatedThread, setGeneratedThread, optimizations, isLoading, loadingMessage, platform }: ResultsPanelProps) {
  return (
    <Card className="sticky top-24">
      <Tabs defaultValue="preview">
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>Results</CardTitle>
              <CardDescription>Preview, edit, and optimize your new thread.</CardDescription>
            </div>
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="optimize" disabled={!generatedThread && !optimizations}>Optimize</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="min-h-[500px]">
          <TabsContent value="preview">
            {isLoading && !generatedThread ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
              </div>
            ) : generatedThread ? (
              <ThreadPreview generatedThread={generatedThread} setGeneratedThread={setGeneratedThread} platform={platform} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border-2 border-dashed rounded-lg bg-card/50">
                <Wand2 className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">Your generated thread will appear here.</p>
                <p className="text-sm text-muted-foreground">Fill out the form and click "Generate Thread" to start.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="optimize">
            {isLoading && !optimizations ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Generating optimizations...</p>
              </div>
            ) : optimizations ? (
              <OptimizationSuggestionsComponent optimizations={optimizations} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border-2 border-dashed rounded-lg bg-card/50">
                <Lightbulb className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">AI-powered suggestions will appear here.</p>
                <p className="text-sm text-muted-foreground">Suggestions are generated along with your thread.</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
