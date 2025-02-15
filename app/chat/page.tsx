"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "../context/AuthContext"
import { useWebSocket } from "../context/WebSocketContext"
import { useSearchParams, useRouter } from "next/navigation"
import { fetchChatSessions, createChatSession, deleteChatSession } from "../services/chatService"
import ChatSession from "../components/ChatSession"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "../components/LoadingSpinner"
import { Menu, X } from "lucide-react"

function ChatContent() {
  const { user, isLoading } = useAuth()
  const { isConnected } = useWebSocket()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [chatSessions, setChatSessions] = useState([])
  const [newSessionTitle, setNewSessionTitle] = useState("")
  const [activeSession, setActiveSession] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadChatSessions()
    }
  }, [user])

  useEffect(() => {
    async function initializeSession() {
      if (!chatSessions.length) return;

      const sessionId = searchParams.get('sessionId')
      const isNew = searchParams.get('new')

      if (sessionId) {
        const session = chatSessions.find((s: any) => s.id === sessionId)
        if (session) {
          setActiveSession(session)
        }
      } else if (isNew) {
        setActiveSession(null)
        setNewSessionTitle("")
      }
    }

    initializeSession()
  }, [searchParams, chatSessions])

  async function loadChatSessions() {
    try {
      if (!user) return
      const response = await fetchChatSessions(user.jwt)
      setChatSessions(response.data)
    } catch (error) {
      console.error("Failed to load chat sessions:", error)
    }
  }

  async function handleCreateSession() {
    if (newSessionTitle.trim() && user) {
      try {
        const response = await createChatSession(newSessionTitle, user?.id.toString(), user?.jwt)
        setNewSessionTitle("")
        await loadChatSessions()
        // Update URL with new session ID
        router.push(`/chat?sessionId=${response.data.id}`)
      } catch (error) {
        console.error("Failed to create chat session:", error)
      }
    }
  }

  async function handleDeleteSession(sessionId: string) {
    try {
      await deleteChatSession(sessionId, user?.jwt)
      await loadChatSessions()
      setActiveSession(null)
      router.push('/chat?new=true')
    } catch (error) {
      console.error("Failed to delete chat session:", error)
    }
  }

  function handleSelectSession(session: any) {
    setActiveSession(session)
    router.push(`/chat?sessionId=${session.id}`)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Please log in to access the chat.</div>
  }

  return (
    <div className="flex h-screen relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden absolute top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <div className={`
        fixed lg:relative
        w-80 lg:w-1/4
        bg-gray-100 
        p-4 
        overflow-y-auto
        h-screen
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40
      `}>
        <h2 className="text-xl font-bold mb-4 mt-12 lg:mt-0">Chat Sessions</h2>
        <div className="flex mb-4">
          <Input
            type="text"
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
            placeholder="New session title"
            className="mr-2"
          />
          <Button onClick={handleCreateSession}>Create</Button>
        </div>
        <ul>
          {chatSessions && chatSessions.length > 0 && chatSessions.map((session: any) => (
            <li key={session.id} className="mb-2 flex justify-between items-center">
              <button
                onClick={() => {
                  handleSelectSession(session)
                  setIsSidebarOpen(false)
                }}
                className={`text-left p-2 rounded hover:bg-gray-200 flex-1 ${
                  (activeSession && activeSession.id === session.id) || 
                  (searchParams.get('sessionId') === session.id) ? "bg-gray-200 font-bold" : ""
                }`}
              >
                {session.Title}
              </button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDeleteSession(session.id)}
                className="ml-2"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 p-4 lg:p-8">
        {activeSession ? (
          <ChatSession session={activeSession} />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            {searchParams.get('new') ? (
              <div>
                <p className="mb-4">Create a new chat session to start messaging</p>
                <p className="text-sm">Enter a title in the sidebar and click Create</p>
              </div>
            ) : (
              <p>Select a chat session to start messaging</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatContent />
    </Suspense>
  )
}

