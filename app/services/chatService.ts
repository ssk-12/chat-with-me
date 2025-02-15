const API_URL = "http://localhost:1337/api"


export async function createChatSession(title: string, userId: string, jwt?: string) {
  const response = await fetch(`${API_URL}/chat-sessions`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify({
      data: {
        Title: title,
        user: userId,
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create chat session")
  }

  return response.json()
}

export async function deleteChatSession(sessionId: string, jwt?: string) {
  const response = await fetch(`${API_URL}/chat-sessions/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error("Failed to delete chat session")
  }

  return true
}

export async function fetchChatSessions(jwt? : string) {
  const response = await fetch(`${API_URL}/chat-sessions`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error("Failed to fetch chat sessions")
  }

  return response.json()
}

export async function fetchMessages(sessionId: string, jwt?: string) {
  const response = await fetch(`${API_URL}/messages?filters[chat_session][id][$eq]=${sessionId}`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error("Failed to fetch messages")
  }

  return response.json()
}

