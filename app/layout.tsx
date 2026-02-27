import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerSwarm — AI Application Engine for Executives',
  description:
    'Turn 4 hours per application into 4 minutes. CareerSwarm builds your Career DNA database and generates perfectly tailored executive applications in under 3 minutes.',
  openGraph: {
    title: 'CareerSwarm — AI Application Engine for Executives',
    description: 'Turn 4 hours per application into 4 minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
