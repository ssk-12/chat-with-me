"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "../actions/auth"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { User, Mail, Lock } from "lucide-react"

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await signUp(formData)

    if (result.success) {
      setUser(result.user)
      localStorage.setItem("user", JSON.stringify(result.user))
      toast.success("Signed up successfully")
      router.push("/dashboard")
    } else {
      toast.error(result.error || "Sign up failed")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input id="username" name="username" placeholder="Choose a username" required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input id="email" name="email" type="email" placeholder="Enter your email" required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Choose a password"
            required
            className="pl-10"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  )
}

