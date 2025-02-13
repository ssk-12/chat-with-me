"use client"

import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {user.username}!</h1>
      <p className="mb-4">Email: {user.email}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}

