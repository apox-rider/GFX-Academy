'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  full_name: string | null
  phone_number: string | null
  created_at?: string
  subscriptions?: Subscription[]
}

interface Subscription {
  id: string
  package_tier: 'bronze' | 'silver' | 'gold' | 'free'
  status: string
  end_date: string | null
}

interface AuthContextType {
  user: User | null
  subscription: Subscription | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  phone_number: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      
      if (data.authenticated && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          phone_number: data.user.phone_number,
        })

        if (data.user.subscriptions) {
          const activeSub = data.user.subscriptions.find(
            (sub: Subscription) => sub.status === 'active'
          )
          setSubscription(activeSub || null)
        } else {
          setSubscription(null)
        }
      } else {
        setUser(null)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
      setSubscription(null)
    }
  }

  const refreshUser = async () => {
    await fetchUserData()
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserData()
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || 'Login failed' }
      }

      setUser({
        id: result.user.id,
        email: result.user.email,
        full_name: result.user.full_name,
        phone_number: result.user.phone_number,
      })

      if (result.user.subscriptions) {
        const activeSub = result.user.subscriptions.find(
          (sub: Subscription) => sub.status === 'active'
        )
        setSubscription(activeSub || null)
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Connection error. Please try again.' }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || 'Registration failed' }
      }

      setUser({
        id: result.user.id,
        email: result.user.email,
        full_name: result.user.full_name,
        phone_number: result.user.phone_number || null,
      })

      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Connection error. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setSubscription(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
