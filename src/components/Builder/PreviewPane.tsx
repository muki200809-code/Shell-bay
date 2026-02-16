import React, { useEffect, useRef, useState } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewPaneProps {
  code: string
  deviceMode: 'desktop' | 'tablet' | 'mobile'
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ code, deviceMode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      case 'desktop':
      default:
        return '100%'
    }
  }

  useEffect(() => {
    if (!code || !iframeRef.current) return

    setError(null)

    try {
      const iframeDoc = iframeRef.current.contentDocument
      if (!iframeDoc) return

      // Create full HTML document with React
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    ${code}
    
    // Find the default export
    const Component = typeof App !== 'undefined' ? App : 
                      typeof default !== 'undefined' ? default : null;
    
    if (Component) {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<Component />);
    } else {
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: red;">No default export found. Please export your component as default.</div>';
    }
  </script>
</body>
</html>
      `

      iframeDoc.open()
      iframeDoc.write(htmlContent)
      iframeDoc.close()

      // Listen for errors in iframe
      iframeRef.current.contentWindow?.addEventListener('error', (e) => {
        setError(e.message)
      })
    } catch (err: any) {
      setError(err.message)
    }
  }, [code, key])

  const handleRefresh = () => {
    setKey((prev) => prev + 1)
    setError(null)
  }

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-zinc-900/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            localhost:3000
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="hover:bg-accent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        {!code ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Code Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start chatting with the AI to generate your app
            </p>
          </div>
        ) : error ? (
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: getDeviceWidth(),
              height: deviceMode === 'mobile' ? '667px' : '100%',
              maxHeight: '100%',
            }}
          >
            <iframe
              ref={iframeRef}
              key={key}
              title="App Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-modals"
            />
          </div>
        )}
      </div>
    </div>
  )
}
