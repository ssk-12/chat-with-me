'use client'

import { useState, useEffect, useRef } from "react"
import { useWebSocket } from "../context/WebSocketContext"
import { useAuth } from "../context/AuthContext"
import { fetchMessages } from "../services/chatService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, User, Bot } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const { socket, isConnected } = useWebSocket()
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
      
      <CardContent className="p-4 md:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold truncate">{session.Title}</h2>
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            Back
          </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-[300px] max-h-[calc(100vh-200px)]">
          <div className="space-y-4 pr-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[85%] md:max-w-[70%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="break-words">{message.Content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 ${message.isUser ? 'ml-2' : 'mr-2'}`}>
                    {message.isUser ? <User size={24} /> : <Bot size={24} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="relative mt-4">
          
          <div className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} size="icon">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}