'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, ClipboardCheck } from 'lucide-react';
import type { GeneratedThread } from '@/components/thread-generator';
import { cn } from '@/lib/utils';

interface ThreadPreviewProps {
  generatedThread: GeneratedThread;
  setGeneratedThread: React.Dispatch<React.SetStateAction<GeneratedThread | null>>;
  platform: 'Twitter' | 'LinkedIn';
}

export function ThreadPreview({ generatedThread, setGeneratedThread, platform }: ThreadPreviewProps) {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<boolean[]>([]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
    const newCopiedStates = [...copiedStates];
    newCopiedStates[index] = true;
    setCopiedStates(newCopiedStates);
    setTimeout(() => {
      const resetCopiedStates = [...newCopiedStates];
      resetCopiedStates[index] = false;
      setCopiedStates(resetCopiedStates);
    }, 2000);
  };

  const handleCopyAll = () => {
    const allTweets = generatedThread.thread.map((tweet, index) => `${index + 1}/${generatedThread.thread.length}\n${tweet}`).join('\n\n');
    navigator.clipboard.writeText(allTweets);
    toast({ title: 'Entire thread copied!' });
  };

  const handleTweetChange = (index: number, newText: string) => {
    const newThread = [...generatedThread.thread];
    newThread[index] = newText;
    setGeneratedThread({ thread: newThread });
  };

  const charLimit = platform === 'Twitter' ? 280 : 3000;

  return (
    <div className="space-y-4">
      <Button onClick={handleCopyAll} variant="outline">
        <Copy className="mr-2 h-4 w-4" /> Copy All
      </Button>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {generatedThread.thread.map((tweet, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-muted-foreground">
                  Post {index + 1} / {generatedThread.thread.length}
                </p>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(tweet, index)}>
                  {copiedStates[index] ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Textarea
                value={tweet}
                onChange={(e) => handleTweetChange(index, e.target.value)}
                className="w-full border-0 focus-visible:ring-1 focus-visible:ring-ring p-0 min-h-[80px] bg-transparent resize-none"
              />
              <div className={cn(
                "text-right text-sm text-muted-foreground mt-2",
                tweet.length > charLimit && "text-destructive"
              )}>
                {tweet.length} / {charLimit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
