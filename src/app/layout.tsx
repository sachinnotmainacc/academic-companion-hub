import '@/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-dark-800">
      <body className="min-h-screen bg-dark-950 antialiased">
        {children}
      </body>
    </html>
  )
} 