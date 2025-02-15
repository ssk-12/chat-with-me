'use client'

import { useState, useEffect, useRef } from "react"
import { useWebSocket } from "../context/WebSocketContext"
import { useAuth } from "../context/AuthContext"
import { fetchMessages } from "../services/chatService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, User, Bot } from 'lucide-react'

interface Message {
  id: number
  Content: string
  createdAt: string
  isUser: boolean
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
  }, [messages])

  async function loadMessages() {
    try {
      if (!user) return
      const response = await fetchMessages(session.id, user.jwt)
      setMessages(response.data.map((msg: Message, index: number) => ({ ...msg, isUser: [true, false, true, false, true, false, true, false][index % 8] })))
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  function handleReceiveMessage(message: Message) {
    setMessages((prevMessages) => [...prevMessages, { ...message, isUser: false }])
  }

  function sendMessage() {
    if (newMessage.trim() && socket && user) {
      const userMessage = { id: Date.now(), Content: newMessage, createdAt: new Date().toISOString(), isUser: true }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      
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
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4">{session.Title}</h2>
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[70%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {message.Content}
                </div>
                <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
                  {message.isUser ? <User size={24} /> : <Bot size={24} />}
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} className="p-2">
            <Send size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}