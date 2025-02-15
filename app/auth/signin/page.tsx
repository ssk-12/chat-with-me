"use client"

import SignInForm from "@/app/components/SignInForm"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { UserCircleIcon } from "lucide-react"
import { signIn } from "@/app/actions/auth"

export default function SignInPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleDemoLogin = async () => {
    try {
      const formData = new FormData()
      formData.append("email", "demo@demo.com")
      formData.append("password", "demo@demo.com")
      await signIn(formData)
    } catch (error) {
      console.error("Demo login failed:", error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Sign In</h1>
        <SignInForm />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <UserCircleIcon className="w-5 h-5" />
          <span>Continue with Demo Account</span>
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

