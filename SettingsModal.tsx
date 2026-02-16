import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore.ts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Key, Shield, Check } from 'lucide-react'

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    aiProvider,
    setAIProvider,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    anthropicApiKey,
    setAnthropicApiKey,
  } = useAppStore()

  const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey)
  const [localOpenaiKey, setLocalOpenaiKey] = useState(openaiApiKey)
  const [localAnthropicKey, setLocalAnthropicKey] = useState(anthropicApiKey)

  const handleSave = () => {
    setGeminiApiKey(localGeminiKey)
    setOpenaiApiKey(localOpenaiKey)
    setAnthropicApiKey(localAnthropicKey)
    setSettingsOpen(false)
  }

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="sm:max-w-2xl glass">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Engine Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AI provider and API keys
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Provider Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">AI Provider</label>
            <div className="grid grid-cols-1 gap-3">
              {/* Gemini Option (Default) */}
              <button
                onClick={() => setAIProvider('gemini')}
                className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                  aiProvider === 'gemini'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Shell Bay Free</h3>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Powered by Google Gemini 1.5 Flash
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Free forever. Requires your own Google AI Studio API key (free to obtain).
                    </p>
                  </div>
                  {aiProvider === 'gemini' && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>

              {/* OpenAI Option */}
              <button
                onClick={() => setAIProvider('openai')}
                className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                  aiProvider === 'openai'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">OpenAI</h3>
                    <p className="text-sm text-muted-foreground">
                      GPT-4 and GPT-3.5 Turbo
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Bring your own OpenAI API key.
                    </p>
                  </div>
                  {aiProvider === 'openai' && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>

              {/* Anthropic Option */}
              <button
                onClick={() => setAIProvider('anthropic')}
                className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                  aiProvider === 'anthropic'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Anthropic Claude</h3>
                    <p className="text-sm text-muted-foreground">
                      Claude 3.5 Sonnet and Opus
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Bring your own Anthropic API key.
                    </p>
                  </div>
                  {aiProvider === 'anthropic' && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            {aiProvider === 'gemini' && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <Key className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Google AI Studio API Key</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get your free API key from{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google AI Studio
                      </a>
                    </p>
                    <Input
                      type="password"
                      placeholder="Enter your Gemini API key"
                      value={localGeminiKey}
                      onChange={(e) => setLocalGeminiKey(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Your API key is stored locally in your browser and never sent to our servers.
                  </span>
                </div>
              </div>
            )}

            {aiProvider === 'openai' && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <Key className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">OpenAI API Key</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get your API key from{' '}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        OpenAI Platform
                      </a>
                    </p>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={localOpenaiKey}
                      onChange={(e) => setLocalOpenaiKey(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Your API key is stored locally in your browser and never sent to our servers.
                  </span>
                </div>
              </div>
            )}

            {aiProvider === 'anthropic' && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <Key className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Anthropic API Key</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get your API key from{' '}
                      <a
                        href="https://console.anthropic.com/settings/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Anthropic Console
                      </a>
                    </p>
                    <Input
                      type="password"
                      placeholder="sk-ant-..."
                      value={localAnthropicKey}
                      onChange={(e) => setLocalAnthropicKey(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Your API key is stored locally in your browser and never sent to our servers.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => setSettingsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="shadow-lg shadow-primary/30">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
