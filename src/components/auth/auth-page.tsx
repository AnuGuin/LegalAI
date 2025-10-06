"use client"

import LoginForm from "@/components/ui/login-form"

interface AuthPageProps {
  onAuthenticated: (user: { name: string; email: string; avatar?: string }) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  return <LoginForm onAuthenticated={onAuthenticated} />
}