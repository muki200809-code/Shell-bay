import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download } from 'lucide-react'

interface CodeViewProps {
  code: string
}

export const CodeView: React.FC<CodeViewProps> = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'App.tsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-zinc-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-mono text-muted-foreground">App.tsx</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="hover:bg-accent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="hover:bg-accent"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-4">
        {!code ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No code generated yet</p>
            </div>
          </div>
        ) : (
          <pre className="font-mono text-sm">
            <code className="language-typescript text-gray-300">
              {code}
            </code>
          </pre>
        )}
      </div>
    </div>
  )
}
