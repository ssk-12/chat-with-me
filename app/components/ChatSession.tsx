"use client"

import { useState, useEffect, useRef } from "react"
import { useWebSocket } from "../context/WebSocketContext"
import { useAuth } from "../context/AuthContext"
import { fetchMessages } from "../services/chatService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  Content: string
  createdAt: string
}

interface ChatSessionProps {
  session: {
    id: string
    Title: string
    documentId: string
  }
}

export default function ChatSession({ session }: ChatSessionProps) {
  const { socket } = useWebSocket()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    if (socket) {
      socket.emit("joinSession", session.id)
      socket.on("receiveMessage", handleReceiveMessage)
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage", handleReceiveMessage)
        socket.emit("leaveSession", session.id)
      }
    }
  }, [session.id, socket])

  useEffect(() => {
    scrollToBottom()
  }, [])

  async function loadMessages() {
    try {
      if (!user) return
      const response = await fetchMessages(session.id, user.jwt)
      setMessages(response.data)
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  function handleReceiveMessage(message: Message) {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  function sendMessage() {
    if (newMessage.trim() && socket && user) {
      socket.emit("sendMessage", {
        content: newMessage,
        chatSessionId: session.id,
        userId: user.id,
      })
      setNewMessage("")
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">{session.Title}</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.Content}</span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}

