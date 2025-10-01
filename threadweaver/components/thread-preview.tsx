'use client'

import { useState } from 'react'
import { useThreadStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, Check, Download, Twitter, Linkedin } from 'lucide-react'
import { toast } from 'sonner'

export function ThreadPreview() {
  const { generatedThreads, platform, updateTweet } = useThreadStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (generatedThreads.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-slate-500">
            <Twitter className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No thread generated yet</p>
            <p className="text-sm mt-2">Generate a thread to see the preview here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleCopyTweet = async (tweet: any) => {
    await navigator.clipboard.writeText(tweet.content)
    setCopiedId(tweet.id)
    toast.success('Tweet copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyAll = async () => {
    const allText = generatedThreads
      .map((tweet, idx) => `${idx + 1}/${generatedThreads.length}\n\n${tweet.content}`)
      .join('\n\n---\n\n')
    
    await navigator.clipboard.writeText(allText)
    toast.success('Entire thread copied to clipboard!')
  }

  const handleExport = () => {
    const text = generatedThreads
      .map((tweet, idx) => `Tweet ${idx + 1}/${generatedThreads.length}\n\n${tweet.content}`)
      .join('\n\n' + '='.repeat(50) + '\n\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `thread-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Thread exported!')
  }

  const getCharacterLimit = () => {
    return platform === 'twitter' ? 280 : 3000
  }

  const getPlatformIcon = () => {
    if (platform === 'twitter') return <Twitter className="h-4 w-4" />
    if (platform === 'linkedin') return <Linkedin className="h-4 w-4" />
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getPlatformIcon()}
              Thread Preview
            </CardTitle>
            <CardDescription>
              {generatedThreads.length} tweets • Edit any tweet by clicking on it
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopyAll} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedThreads.map((tweet, index) => {
          const isEditing = editingId === tweet.id
          const characterLimit = getCharacterLimit()
          const isOverLimit = tweet.characterCount > characterLimit

          return (
            <div key={tweet.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {index + 1} / {generatedThreads.length}
                </Badge>
                <div className="flex items-center gap-2">
                  <span 
                    className={`text-sm ${isOverLimit ? 'text-red-600 font-medium' : 'text-slate-600'}`}
                  >
                    {tweet.characterCount} / {characterLimit}
                  </span>
                  <Button
                    onClick={() => handleCopyTweet(tweet)}
                    variant="ghost"
                    size="sm"
                  >
                    {copiedId === tweet.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={tweet.content}
                    onChange={(e) => updateTweet(tweet.id, e.target.value)}
                    className="min-h-[100px]"
                    autoFocus
                  />
                  <Button
                    onClick={() => setEditingId(null)}
                    size="sm"
                    variant="secondary"
                  >
                    Done Editing
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingId(tweet.id)}
                  className={`p-4 rounded-lg border cursor-pointer hover:border-blue-300 transition-colors ${
                    isOverLimit ? 'border-red-300 bg-red-50' : 'bg-slate-50'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{tweet.content}</p>
                </div>
              )}

              {isOverLimit && (
                <p className="text-xs text-red-600">
                  ⚠️ This tweet exceeds the character limit. Please edit it.
                </p>
              )}

              {index < generatedThreads.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
