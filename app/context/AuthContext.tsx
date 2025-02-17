"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout as logoutAction } from "../actions/auth"

type User = {
  id: number
  username: string
  email: string
  jwt: string
}

type AuthContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => void
  isLoading: boolean
  jwt: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", { credentials: "include" })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem("user")
      const response = await logoutAction()
      if (response.success) {
        router.push("/auth/signin")
        localStorage.removeItem("user")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const [jwt, setJwt] = useState<string>("")

  return <AuthContext.Provider value={{ user, setUser, logout, isLoading, jwt }}>{children}</AuthContext.Provider>
}
