import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore.ts'
import { Button } from '@/components/ui/button'
import { Shell, Monitor, Tablet, Smartphone, Code2, Eye, Rocket, ArrowLeft, Settings } from 'lucide-react'
import { ChatPane } from './ChatPane'
import { PreviewPane } from './PreviewPane'
import { CodeView } from './CodeView'

export const Workspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    previewMode,
    setPreviewMode,
    showCode,
    setShowCode,
    setSettingsOpen,
  } = useAppStore()

  const [isDeploying, setIsDeploying] = useState(false)

  const currentProject = projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (projectId && projectId !== currentProjectId) {
      setCurrentProject(projectId)
    }
  }, [projectId, currentProjectId, setCurrentProject])

  useEffect(() => {
    if (!currentProject) {
      navigate('/dashboard')
    }
  }, [currentProject, navigate])

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert('🚀 App deployed successfully! (This is a demo)')
    setIsDeploying(false)
  }

  if (!currentProject) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        {/* Left: Back & Project Info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Shell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{currentProject.name}</h1>
              <p className="text-xs text-muted-foreground">
                {currentProject.messages.length} messages
              </p>
            </div>
          </div>
        </div>

        {/* Center: Device Toggles */}
        <div className="flex items-center gap-2 glass rounded-lg p-1">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded transition-colors ${
              previewMode === 'desktop'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode('tablet')}
            className={`p-2 rounded transition-colors ${
              previewMode === 'tablet'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded transition-colors ${
              previewMode === 'mobile'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCode(!showCode)}
            className="hover:bg-accent"
            title={showCode ? 'Show Preview' : 'Show Code'}
          >
            {showCode ? <Eye className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="hover:bg-accent"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleDeploy}
            disabled={isDeploying || !currentProject.code}
            className="shadow-lg shadow-primary/30 animate-glow"
          >
            <Rocket className="w-4 h-4 mr-2" />
            {isDeploying ? 'Deploying...' : 'Ship to Cloud'}
          </Button>
        </div>
      </header>

      {/* Main Content: Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Pane */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <ChatPane project={currentProject} />
        </div>

        {/* Right: Preview or Code */}
        <div className="w-1/2 flex flex-col bg-zinc-900">
          {showCode ? (
            <CodeView code={currentProject.code} />
          ) : (
            <PreviewPane code={currentProject.code} deviceMode={previewMode} />
          )}
        </div>
      </div>
    </div>
  )
}
