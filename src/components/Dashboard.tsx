import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getCurrentUser, signOut } from '@/lib/supabaseClient'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Plus,
  Settings,
  Shell,
  Clock,
  Sparkles,
  Code,
  LogOut,
  Search,
  Trash2,
} from 'lucide-react'
import { SettingsModal } from './SettingsModal'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { projects, addProject, setCurrentProject, deleteProject, setSettingsOpen } = useAppStore()

  useEffect(() => {
    const initUser = async () => {
      const { user } = await getCurrentUser()
      if (!user) {
        navigate('/auth')
      } else {
        setUser(user)
      }
    }
    initUser()
  }, [navigate])

  const handleNewProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: 'Untitled Project',
      description: 'A new Shell Bay project',
      createdAt: new Date().toISOString(),
      code: '',
      messages: [],
    }
    addProject(newProject)
    setCurrentProject(newProject.id)
    navigate(`/builder/${newProject.id}`)
  }

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId)
    navigate(`/builder/${projectId}`)
  }

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Shell className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">Shell Bay</span>
        </div>

        {/* New Project Button */}
        <Button
          onClick={handleNewProject}
          className="w-full mb-6 shadow-lg shadow-primary/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>

        {/* Project History */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
            Recent Projects
          </h3>
          <div className="space-y-1">
            {projects.slice(0, 10).map((project) => (
              <button
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors group flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Code className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">{project.name}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 mb-2">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSettingsOpen(true)}
              variant="ghost"
              size="sm"
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Build amazing web apps with the power of AI
          </p>
        </div>

        {/* Search */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Start Building</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first project and let AI help you build amazing web applications
              </p>
              <Button onClick={handleNewProject} size="lg" className="shadow-lg shadow-primary/30">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className="glass rounded-xl p-6 text-left hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:to-blue-600/10 transition-all duration-300 rounded-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                        <Code className="w-6 h-6 text-cyan-400" />
                      </div>
                      <button
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-destructive/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 truncate">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <SettingsModal />
    </div>
  )
}
