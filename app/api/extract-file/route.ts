import { NextRequest, NextResponse } from 'next/server'

// Server-side file text extraction — handles PDF and DOCX
// PDF.js and Mammoth run server-side only (no browser restrictions)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (ext === 'pdf') {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as string)
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
      const pages: string[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        pages.push(content.items.map((item: { str: string }) => item.str).join(' '))
      }
      text = pages.join('\n')
    } else if (ext === 'docx' || ext === 'doc') {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
      text = buffer.toString('utf-8')
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (err) {
    console.error('[extract-file]', err)
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 })
  }
}
