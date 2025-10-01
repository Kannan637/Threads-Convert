'use client'

import { useState } from 'react'
import { useThreadStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Link as LinkIcon, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function ThreadGenerator() {
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text')
  const [url, setUrl] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)

  const {
    originalContent,
    platform,
    style,
    threadLength,
    isGenerating,
    setOriginalContent,
    setPlatform,
    setStyle,
    setThreadLength,
    setIsGenerating,
    setGeneratedThreads,
  } = useThreadStore()

  const handleExtractUrl = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    setIsExtracting(true)
    try {
      const response = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract content')
      }

      const data = await response.json()
      setOriginalContent(data.content)
      toast.success('Content extracted successfully!')
    } catch (error) {
      toast.error('Failed to extract content from URL')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleGenerate = async () => {
    if (!originalContent || originalContent.trim().length < 100) {
      toast.error('Please provide at least 100 characters of content')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/threads/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalContent,
          platform,
          style,
          threadLength,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate thread')
      }

      const data = await response.json()
      setGeneratedThreads(data.thread.threads)
      toast.success('Thread generated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate thread')
    } finally {
      setIsGenerating(false)
    }
  }

  const wordCount = originalContent.split(/\s+/).filter(Boolean).length
  const charCount = originalContent.length
  const estimatedTweets = Math.ceil(charCount / 250)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Thread Generator
        </CardTitle>
        <CardDescription>
          Paste your content or URL to generate an engaging thread
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Mode Tabs */}
        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'text' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-2" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              URL Extract
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Paste your long-form content here... (blog post, article, newsletter, etc.)"
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex gap-4 text-sm text-slate-600">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <Badge variant="secondary">~{estimatedTweets} tweets</Badge>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
              />
              <Button 
                onClick={handleExtractUrl} 
                disabled={isExtracting}
                variant="secondary"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  'Extract'
                )}
              </Button>
            </div>
            {originalContent && (
              <Textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Configuration Options */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Style</label>
            <Select value={style} onValueChange={(v: any) => setStyle(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Thread Length</label>
            <Select 
              value={threadLength.toString()} 
              onValueChange={(v) => setThreadLength(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 tweets</SelectItem>
                <SelectItem value="7">7 tweets</SelectItem>
                <SelectItem value="10">10 tweets</SelectItem>
                <SelectItem value="12">12 tweets</SelectItem>
                <SelectItem value="15">15 tweets</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !originalContent}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Your Thread...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Thread
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
