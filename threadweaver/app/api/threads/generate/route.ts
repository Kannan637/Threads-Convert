import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateThread, ThreadGenerationParams } from '@/lib/openai'
import { canCreateThread } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        threads: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(1)), // First day of current month
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check subscription limits
    const threadCount = user.threads.length
    if (!canCreateThread(threadCount, user.subscriptionTier)) {
      return NextResponse.json(
        { error: 'Thread limit reached for your subscription tier' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content, platform, style, threadLength, title } = body

    if (!content || !platform || !style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate thread using OpenAI
    const params: ThreadGenerationParams = {
      content,
      platform,
      style,
      threadLength: threadLength || 10,
    }

    const generatedThreads = await generateThread(params)

    // Save to database
    const thread = await prisma.thread.create({
      data: {
        userId: user.id,
        title: title || `Thread - ${new Date().toLocaleDateString()}`,
        originalContent: content,
        generatedThread: generatedThreads,
        platform,
        style,
        threadLength: generatedThreads.length,
      },
    })

    return NextResponse.json({
      success: true,
      thread: {
        id: thread.id,
        threads: generatedThreads,
        platform,
        style,
      },
    })
  } catch (error) {
    console.error('Error generating thread:', error)
    return NextResponse.json(
      { error: 'Failed to generate thread' },
      { status: 500 }
    )
  }
}
