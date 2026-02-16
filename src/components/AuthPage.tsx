import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shell, Waves, Mail, CheckCircle, AlertCircle, Loader2, Apple } from 'lucide-react'

export const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    // Check for OAuth callback errors in URL
    const params = new URLSearchParams(window.location.search)
    const errorMsg = params.get('error_description') || params.get('error')
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg))
    }
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
        
        if (error) throw error

        // Check if email confirmation is required
        if (data.user && !data.session) {
          setSuccess('✅ Account created! Please check your email to confirm your account.')
          setEmail('')
          setPassword('')
        } else if (data.session) {
          // Auto-confirmed (email confirmation disabled in Supabase)
          setSuccess('✅ Account created successfully! Redirecting...')
          setTimeout(() => navigate('/dashboard'), 1500)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.')
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email address before signing in.')
          }
          throw error
        }

        setSuccess('✅ Signed in successfully! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 1000)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthAuth = async (provider: 'google' | 'apple') => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: false,
        },
      })
      
      if (error) {
        // Handle specific OAuth errors
        if (error.message.includes('not enabled')) {
          throw new Error(
            `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign In is not enabled. ` +
            `Please enable it in your Supabase Dashboard: Authentication → Providers → ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
          )
        }
        throw error
      }
      
      // OAuth redirect will happen automatically, so we keep loading state
      // Don't set loading to false here as the redirect will happen
    } catch (err: any) {
      console.error('OAuth error:', err)
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md p-8 m-4">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/50 animate-pulse">
              <Shell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Shell Bay</span>
            </h1>
            <p className="text-muted-foreground">Build anything with AI</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <span className="text-destructive">{error}</span>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-green-500">{success}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => handleOAuthAuth('google')}
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 font-medium shadow-lg"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <Button
              onClick={() => handleOAuthAuth('apple')}
              disabled={loading}
              className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium shadow-lg"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Apple className="w-5 h-5 mr-2" />
              )}
              Continue with Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-medium shadow-lg shadow-primary/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </>
              )}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError('')
                setSuccess('')
              }}
              disabled={loading}
              className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Help text */}
          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </div>
          )}
        </div>

        {/* Decorative wave at bottom */}
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center opacity-20">
          <Waves className="w-32 h-32 text-cyan-500" />
        </div>
      </div>
    </div>
  )
}
