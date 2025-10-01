'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThreadGenerator } from '@/components/thread-generator'
import { ThreadPreview } from '@/components/thread-preview'
import { Sparkles, LogOut, Settings, History } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardClient() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">ThreadWeaver</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="capitalize">
              {/* @ts-ignore */}
              {session?.user?.subscriptionTier || 'free'} Plan
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{session?.user?.name || 'User'}</span>
                    <span className="text-xs font-normal text-slate-500">
                      {session?.user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/history">
                    <History className="h-4 w-4 mr-2" />
                    Thread History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Your Thread
          </h1>
          <p className="text-slate-600">
            Transform your content into engaging social media threads in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ThreadGenerator />
          </div>
          <div>
            <ThreadPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
