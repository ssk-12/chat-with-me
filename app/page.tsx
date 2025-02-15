import Image from "next/image";
import Link from "next/link";
import { Github, Mail, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to Chat-with-Me Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A simple WebSocket-based chat platform enabling real-time communication between user and server 😶‍🌫️
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/signin">
                  <Button className="gap-2">
                    Get Started <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="gap-2">
                    Sign Up <MessageSquare size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                About the Developer
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Developed with passion by Ullegadda Saisrikanta
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/ssk-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
                <a
                  href="mailto:ullegadda.srikanta@gmail.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-gray-200 dark:border-gray-800">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-gray-500 md:text-left dark:text-gray-400">
              Built with Next.js and Tailwind CSS.
            </p>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 Chat-with-Me Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
