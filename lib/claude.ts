import Anthropic from '@anthropic-ai/sdk'

// Model selection — intentional.
// Opus: Career DNA synthesis (multi-document, long context, complex reasoning)
// Sonnet: Everything else (fast, cost-effective, still excellent quality)
export const MODELS = {
  synthesis: 'claude-opus-4-6',   // Career DNA extraction from 20 resumes
  generation: 'claude-sonnet-4-6', // Resume tailoring, cover letters, scoring
  fast: 'claude-haiku-4-5-20251001', // Roast, scoring, cheap fast tasks
} as const

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function callClaude({
  model,
  system,
  messages,
  maxTokens = 4096,
}: {
  model: (typeof MODELS)[keyof typeof MODELS]
  system: string
  messages: ClaudeMessage[]
  maxTokens?: number
}): Promise<string> {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages,
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude')
  return block.text
}

export function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    return JSON.parse(clean) as T
  } catch {
    // Greedy regex fails on nested structures and explanation text.
    // Walk forward from the first { or [ to find its matching closing bracket.
    const start = clean.search(/[{[]/)
    if (start !== -1) {
      const opener = clean[start]
      const closer = opener === '{' ? '}' : ']'
      let depth = 0
      let inString = false
      let escape = false
      for (let i = start; i < clean.length; i++) {
        const ch = clean[i]
        if (escape) { escape = false; continue }
        if (ch === '\\' && inString) { escape = true; continue }
        if (ch === '"') { inString = !inString; continue }
        if (inString) continue
        if (ch === opener) depth++
        else if (ch === closer) {
          depth--
          if (depth === 0) {
            return JSON.parse(clean.slice(start, i + 1)) as T
          }
        }
      }
    }
    throw new Error(`Failed to parse Claude JSON response: ${clean.slice(0, 200)}`)
  }
}
