"use server"

import { cookies } from "next/headers"

const API_URL = process.env.API_URL

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error.message || "Signup failed")
    }

    const data = await response.json()

    const cookieStore = await cookies()
    await cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function signIn(formData: FormData) {
  const identifier = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error.message || "Login failed")
    }

    const data = await response.json()

    const cookieStore = await cookies()
    cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("jwt")
  return { success: true }
}

