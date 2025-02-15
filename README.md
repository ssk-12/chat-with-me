# Chat With Me 🤖💬

A real-time chat application built with modern web technologies that enables seamless communication between users and server, to demonstrate the web socket communication. Try it out at [chat-with-me-taupe.vercel.app](https://chat-with-me-taupe.vercel.app)!

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Reusable component system
- **Lucide Icons** - Beautiful icon system
- **React Hook Form** - Form validation
- **Socket.io-client** - Real-time WebSocket communication

### Backend Integration
- **WebSocket** - Real-time bidirectional communication
- **JWT Authentication** - Secure user authentication
- **REST API** - HTTP endpoints for data fetching

### State Management & Utilities
- **React Context** - Application state management
- **React Hooks** - Component logic
- **next/navigation** - Client-side routing

## 🏗️ Project Structure

```
chat-with-me/
├── app/
│   ├── actions/
│   │   └── auth.ts           # Authentication actions
│   ├── auth/
│   │   ├── signin/          # Sign in page
│   │   └── signup/          # Sign up page
│   ├── chat/
│   │   └── page.tsx         # Chat interface
│   ├── components/
│   │   ├── ChatSession.tsx  # Chat session component
│   │   ├── SignInForm.tsx   # Sign in form
│   │   └── SignUpForm.tsx   # Sign up form
│   ├── context/
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── WebSocketContext.tsx # WebSocket context
│   ├── services/
│   │   └── chatService.ts   # Chat API services
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   └── ui/                  # Shadcn UI components
├── lib/
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
└── styles/                  # Global styles
```

## ✨ Features

- 🔐 **Secure Authentication**
  - JWT-based auth system
  - Protected routes
  - Persistent sessions

- 💬 **Real-time Chat**
  - WebSocket connection
  - Message history
  - Typing indicators
  - Read receipts

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light mode
  - Custom scrollbars
  - Loading states
  - Toast notifications

- 📱 **Multi-platform Support**
  - Desktop optimization
  - Mobile responsiveness
  - Touch device support

- 🔄 **Session Management**
  - Multiple chat sessions
  - Session persistence
  - Real-time updates

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ssk-12/chat-with-me.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👨‍💻 Developer

- **Name**: Ullegadda Saisrikanta
- **Email**: ullegadda.srikanta@gmail.com
- **GitHub**: [github.com/ssk-12](https://github.com/ssk-12)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)


