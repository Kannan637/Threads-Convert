'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowLeft, Calendar, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface Thread {
  id: string
  title: string
  platform: string
  style: string
  threadLength: number
  createdAt: string
  generatedThread: any[]
}

export function ThreadHistoryClient() {
  const { data: session } = useSession()
  const [threads, setThreads] = useState<Thread[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThreads()
  }, [])

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/threads')
      if (response.ok) {
        const data = await response.json()
        setThreads(data.threads)
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">ThreadWeaver</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Thread History
          </h1>
          <p className="text-slate-600">
            View and manage your previously generated threads
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-slate-500">Loading your threads...</div>
          </div>
        ) : threads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
              <Sparkles className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900 mb-2">No threads yet</p>
              <p className="text-slate-600 mb-4">Create your first thread to see it here</p>
              <Link href="/dashboard">
                <Button>Create Thread</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {threads.map((thread) => (
              <Card key={thread.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{thread.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(thread.createdAt), 'PPP')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {thread.platform}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {thread.style}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      {thread.threadLength} tweets
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Thread
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
