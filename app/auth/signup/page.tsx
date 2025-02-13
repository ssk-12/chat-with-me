"use client"

import SignUpForm from "@/app/components/SignUpForm"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingSpinner from "@/app/components/LoadingSpinner"

export default function SignUpPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-shadow-md">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>
        <SignUpForm />
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

