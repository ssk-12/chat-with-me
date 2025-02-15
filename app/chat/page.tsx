"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useWebSocket } from "../context/WebSocketContext"
import { fetchChatSessions, createChatSession, deleteChatSession } from "../services/chatService"
import ChatSession from "../components/ChatSession"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ChatPage() {
  const { user, isLoading } = useAuth()
  const { isConnected } = useWebSocket()
  const [chatSessions, setChatSessions] = useState([])
  const [newSessionTitle, setNewSessionTitle] = useState("")
  const [activeSession, setActiveSession] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadChatSessions()
    }
  }, [user])

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
        await createChatSession(newSessionTitle, user?.id.toString(), user?.jwt)
        setNewSessionTitle("")
        loadChatSessions()
      } catch (error) {
        console.error("Failed to create chat session:", error)
      }
    }
  }

  async function handleDeleteSession(sessionId: string) {
    try {
      const res = await deleteChatSession(sessionId, user?.jwt)
      loadChatSessions()
      setActiveSession(null)
    } catch (error) {
      console.error("Failed to delete chat session:", error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Please log in to access the chat.</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chat Sessions</h2>
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
                onClick={() => setActiveSession(session)}
                className={`text-left ${activeSession && activeSession.id === session.id ? "font-bold" : ""}`}
              >
                {session.Title}
              </button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.documentId)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4">
        {activeSession ? (
          <ChatSession session={activeSession} />
        ) : (
          <div className="text-center text-gray-500">Select a chat session to start messaging</div>
        )}
      </div>
    </div>
  )
}

