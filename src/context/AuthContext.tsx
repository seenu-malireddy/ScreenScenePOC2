import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AuthContextType, User, SignUpData } from '../types'
import FirebaseAuthService from '../services/firebaseAuth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true)
      
      const user = await FirebaseAuthService.signIn(email, password)
      toast.success(t('signInSuccess'))
      
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: SignUpData): Promise<User> => {
    try {
      setLoading(true)
      
      const user = await FirebaseAuthService.signUp(userData)
      toast.success(t('signUpSuccess'))
      toast.success('Please check your email to verify your account')
      
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await FirebaseAuthService.signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
      toast.error(errorMessage)
      throw error
    }
  }

  const updateProfile = async (updatedData: Partial<User>): Promise<User> => {
    try {
      setLoading(true)
      
      const updatedUser = await FirebaseAuthService.updateProfile(updatedData)
      setUser(updatedUser)
      
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}