'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { ThreadGenerationSchema, type ThreadGenerationForm } from '@/lib/types';
import { generateSocialMediaThread } from '@/ai/flows/generate-social-media-thread';
import { suggestOptimalPostingTimes } from '@/ai/flows/suggest-optimal-posting-times';
import { generateCompellingHook } from '@/ai/flows/generate-compelling-hook';
import { GeneratorForm } from '@/components/generator-form';
import { ResultsPanel } from '@/components/results-panel';

export type GeneratedThread = {
  thread: string[];
};

export type OptimizationSuggestions = {
  hook: string;
  postingTimes: {
    suggestedPostTimes: string[];
    reasoning: string;
  };
};

export function ThreadGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedThread, setGeneratedThread] = useState<GeneratedThread | null>(null);
  const [optimizations, setOptimizations] = useState<OptimizationSuggestions | null>(null);
  
  const { toast } = useToast();

  const form = useForm<ThreadGenerationForm>({
    resolver: zodResolver(ThreadGenerationSchema),
    defaultValues: {
      text: '',
      platform: 'Twitter',
      style: 'Professional',
      threadLength: 7,
      targetAudience: '',
    },
  });

  const onSubmit = async (data: ThreadGenerationForm) => {
    setIsLoading(true);
    setGeneratedThread(null);
    setOptimizations(null);

    try {
      const threadPromise = generateSocialMediaThread({
        text: data.text,
        platform: data.platform,
        style: data.style,
        threadLength: data.threadLength,
      });

      const optimizationsPromises = Promise.all([
        generateCompellingHook({ threadContent: data.text }),
        suggestOptimalPostingTimes({ 
          threadContent: data.text,
          platform: data.platform,
          targetAudience: data.targetAudience || 'a general audience',
        }),
      ]);

      const [threadResult, [hookResult, postingTimesResult]] = await Promise.all([threadPromise, optimizationsPromises]);
      
      if (threadResult && threadResult.thread.length > 0) {
        setGeneratedThread(threadResult);
      } else {
        throw new Error('Failed to generate a valid thread. The AI may have returned an empty result.');
      }

      if (hookResult && postingTimesResult) {
        setOptimizations({
          hook: hookResult.hook,
          postingTimes: postingTimesResult
        });
      } else {
        toast({
          variant: "destructive",
          title: "Optimization Failed",
          description: "Could not generate optimization suggestions, but your thread is ready.",
        });
      }
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <GeneratorForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
        <ResultsPanel 
          generatedThread={generatedThread}
          setGeneratedThread={setGeneratedThread}
          optimizations={optimizations}
          isLoading={isLoading}
          platform={form.watch('platform')}
        />
      </div>
    </div>
  );
}
