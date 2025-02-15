"use client"

import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "../components/LoadingSpinner"
import Link from "next/link"
import { MessageSquare, LogOut, Plus } from "lucide-react"
import { fetchChatSessions } from "../services/chatService"
import { Card, CardContent } from "@/components/ui/card"

interface ChatSession {
  id: string
  Title: string
  documentId: string
  createdAt: string
}

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [recentChats, setRecentChats] = useState<ChatSession[]>([])
  const [isLoadingChats, setIsLoadingChats] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function loadRecentChats() {
      if (user) {
        try {
          const response = await fetchChatSessions(user.id.toString(), user.jwt)
          setRecentChats(response.data.slice(0, 5)) 
        } catch (error) {
          console.error("Failed to load recent chats:", error)
        } finally {
          setIsLoadingChats(false)
        }
      }
    }
    loadRecentChats()
  }, [user])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-4">
          <Button onClick={logout} variant="outline" className="gap-2">
            <LogOut size={18} />
            Logout
          </Button>
          <Link href="/chat?new=true">
            <Button className="gap-2">
              <Plus size={18} />
              New Chat
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Chats</h2>
        {isLoadingChats ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : recentChats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentChats.map((chat) => (
              <Link href={`/chat?sessionId=${chat.id}`} key={chat.id}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MessageSquare size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium truncate">{chat.Title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No chats yet</h3>
            <p className="text-gray-500 mb-4">Start a new conversation to get started</p>
            <Link href="/chat?new=true">
              <Button>Start your first chat</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

