import { NextRequest, NextResponse } from 'next/server'

// Server-side file text extraction — handles PDF, DOCX, TXT, MD, RTF
// pdf-parse (Node.js native) and Mammoth run server-side only

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Use all extensions in case of double-extension filenames like "resume.docx.pdf"
    const nameParts = file.name.toLowerCase().split('.')
    const ext = nameParts.pop() // last extension
    const secondExt = nameParts.pop() // second-to-last (catches .docx.pdf etc.)

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (ext === 'pdf') {
      // If file is actually a docx saved with .pdf extension, try docx first
      if (secondExt === 'docx' || secondExt === 'doc') {
        try {
          const mammoth = await import('mammoth')
          const result = await mammoth.extractRawText({ buffer })
          text = result.value
        } catch {
          // Fall through to PDF parsing
        }
      }

      if (!text) {
        const pdfParse = (await import('pdf-parse')).default
        const data = await pdfParse(buffer)
        text = data.text
      }
    } else if (ext === 'docx' || ext === 'doc') {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
      text = buffer.toString('utf-8')
    } else {
      return NextResponse.json({ error: `Unsupported file type: .${ext}` }, { status: 400 })
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'No text could be extracted. The file may be image-based or password-protected.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ text: text.trim() })
  } catch (err) {
    console.error('[extract-file]', err)
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 })
  }
}
