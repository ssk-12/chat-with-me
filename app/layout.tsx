import { AuthProvider } from "./context/AuthContext"
import { WebSocketProvider } from "./context/WebSocketContext"
import { Toaster } from "react-hot-toast"
import "./globals.css"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WebSocketProvider>
            {children}
            <Toaster />
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

