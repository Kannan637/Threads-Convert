import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { extractContentFromUrl } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const content = await extractContentFromUrl(url)

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error('Error extracting URL content:', error)
    return NextResponse.json(
      { error: 'Failed to extract content from URL' },
      { status: 500 }
    )
  }
}
