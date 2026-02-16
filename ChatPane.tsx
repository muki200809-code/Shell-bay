import React, { useState, useRef, useEffect } from 'react'
import { useAppStore, Project, ChatMessage } from '@/store/useAppStore.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { createGeminiService } from '@/lib/ai/geminiService'

interface ChatPaneProps {
  project: Project
}

export const ChatPane: React.FC<ChatPaneProps> = ({ project }) => {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { addMessage, updateCode, geminiApiKey, aiProvider } = useAppStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [project.messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return

    // Check if API key is configured
    if (aiProvider === 'gemini' && !geminiApiKey) {
      alert('Please configure your Google AI Studio API key in Settings first!')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    addMessage(project.id, userMessage)
    setInput('')
    setIsGenerating(true)

    try {
      // Create AI service
      const geminiService = createGeminiService(geminiApiKey)

      // Convert chat history to Gemini format
      const previousMessages = project.messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))

      // Generate code
      let fullResponse = ''
      for await (const chunk of geminiService.streamGenerate(input, previousMessages as any)) {
        fullResponse += chunk
        
        // Update code in real-time
        updateCode(project.id, fullResponse)
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'ve generated the code based on your requirements. Check the preview!',
        timestamp: new Date().toISOString(),
      }

      addMessage(project.id, assistantMessage)
    } catch (error: any) {
      console.error('Error generating code:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message}. Please check your API key in Settings.`,
        timestamp: new Date().toISOString(),
      }

      addMessage(project.id, errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold">AI Architect</h3>
            <p className="text-xs text-muted-foreground">
              Powered by {aiProvider === 'gemini' ? 'Gemini 1.5 Flash' : aiProvider}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {project.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Let's Build Something Amazing</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Describe what you want to build, and I'll generate the code for you.
              </p>
              <div className="space-y-2">
                {[
                  'A todo app with local storage',
                  'A beautiful landing page',
                  'An interactive dashboard',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="w-full text-left px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {project.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="text-sm text-muted-foreground">Generating code...</p>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build..."
            disabled={isGenerating}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isGenerating}
            size="icon"
            className="shadow-lg shadow-primary/30"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
