interface GeminiMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
}

export class GeminiService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateCode(prompt: string, previousMessages: GeminiMessage[] = []): Promise<string> {
    const systemPrompt = `You are an expert full-stack web developer. Generate complete, production-ready React applications based on user requirements.

CRITICAL RULES:
1. Always output COMPLETE, WORKING code
2. Use React with TypeScript
3. Use Tailwind CSS for styling
4. Make it beautiful, modern, and responsive
5. Include all necessary imports
6. Generate a SINGLE FILE React component as a default export
7. Do NOT use external APIs unless explicitly requested
8. Add comments for complex logic
9. Make the UI stunning with gradients, shadows, and modern aesthetics

Output ONLY the code, no explanations before or after. Start with imports and end with the export.`

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...previousMessages,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ]

    const requestBody: GeminiRequest = {
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to generate code')
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return this.extractCode(generatedText)
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw error
    }
  }

  async *streamGenerate(prompt: string, previousMessages: GeminiMessage[] = []): AsyncGenerator<string> {
    const systemPrompt = `You are an expert full-stack web developer. Generate complete, production-ready React applications based on user requirements.

CRITICAL RULES:
1. Always output COMPLETE, WORKING code
2. Use React with TypeScript
3. Use Tailwind CSS for styling
4. Make it beautiful, modern, and responsive
5. Include all necessary imports
6. Generate a SINGLE FILE React component as a default export
7. Do NOT use external APIs unless explicitly requested
8. Add comments for complex logic
9. Make the UI stunning with gradients, shadows, and modern aesthetics

Output ONLY the code, no explanations before or after. Start with imports and end with the export.`

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...previousMessages,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ]

    const requestBody: GeminiRequest = {
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-1.5-flash:streamGenerateContent?key=${this.apiKey}&alt=sse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6)
            if (jsonStr.trim() === '') continue

            try {
              const data = JSON.parse(jsonStr)
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) {
                yield text
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Gemini Streaming Error:', error)
      throw error
    }
  }

  private extractCode(text: string): string {
    // Remove markdown code blocks if present
    const codeBlockRegex = /```(?:typescript|tsx|jsx|javascript)?\n?([\s\S]*?)```/g
    const match = codeBlockRegex.exec(text)
    
    if (match) {
      return match[1].trim()
    }
    
    return text.trim()
  }
}

export const createGeminiService = (apiKey: string) => new GeminiService(apiKey)
