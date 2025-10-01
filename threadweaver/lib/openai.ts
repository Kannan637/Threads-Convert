import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ThreadGenerationParams {
  content: string
  platform: 'twitter' | 'linkedin' | 'both'
  style: 'professional' | 'casual' | 'storytelling' | 'educational'
  threadLength: number
}

export interface Tweet {
  id: string
  content: string
  characterCount: number
  order: number
}

export async function generateThread(params: ThreadGenerationParams): Promise<Tweet[]> {
  const { content, platform, style, threadLength } = params
  
  const maxChars = platform === 'twitter' ? 280 : 3000
  const platformName = platform === 'both' ? 'Twitter and LinkedIn' : platform
  
  const systemPrompt = `You are an expert social media content strategist specializing in creating engaging threads for ${platformName}.

Your task is to convert long-form content into a compelling thread that:
1. Maintains narrative coherence and flow
2. Uses a ${style} tone throughout
3. Creates approximately ${threadLength} posts
4. Keeps each post under ${maxChars} characters
5. Starts with a hook that grabs attention
6. Ends with a strong call-to-action or conclusion
7. Uses natural thread connectors between posts
8. Preserves key insights and important details

Format your response as a JSON array of objects with this structure:
[
  {
    "content": "The tweet text here",
    "order": 1
  },
  ...
]

Important formatting rules:
- For Twitter: Keep each tweet under 280 characters
- For LinkedIn: Keep each post under 3000 characters but aim for 150-300 for better engagement
- Use emojis sparingly and only when they enhance the message
- Include thread numbers if appropriate (1/10, 2/10, etc.)
- Break thoughts at natural points, not mid-sentence`

  const userPrompt = `Convert this content into an engaging ${style} thread for ${platformName}:

${content}

Target length: ${threadLength} posts
Style: ${style}
Platform: ${platformName}

Return ONLY the JSON array, no additional text.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error("No response from OpenAI")
    }

    // Parse the response
    let threadsArray
    try {
      const parsed = JSON.parse(response)
      // Handle both direct array and wrapped object responses
      threadsArray = Array.isArray(parsed) ? parsed : parsed.thread || parsed.tweets || []
    } catch (e) {
      throw new Error("Failed to parse OpenAI response as JSON")
    }

    // Convert to Tweet format
    const tweets: Tweet[] = threadsArray.map((item: any, index: number) => ({
      id: `tweet-${index + 1}`,
      content: item.content || item.text || '',
      characterCount: (item.content || item.text || '').length,
      order: item.order || index + 1,
    }))

    return tweets
  } catch (error) {
    console.error("Error generating thread:", error)
    throw new Error("Failed to generate thread")
  }
}

export async function extractContentFromUrl(url: string): Promise<string> {
  // This is a placeholder - in production, you'd use Puppeteer/Playwright
  // For now, we'll use a simple fetch with cheerio
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    // Basic extraction - remove HTML tags
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    return text.substring(0, 10000) // Limit to first 10k chars
  } catch (error) {
    throw new Error("Failed to extract content from URL")
  }
}
