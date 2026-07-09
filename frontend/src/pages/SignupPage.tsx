import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/useAuthStore"
import { Loader2 } from "lucide-react"
import { Link, Navigate } from "react-router-dom"
import { useState } from "react"

export function SignupPage() {
  const { signInWithGoogle, signUpWithEmail, signInWithGithub, signInWithMicrosoft, signInWithYahoo, user } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await signUpWithEmail(email, password)
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl mb-4">
            <img src="/taskflow_icon.png" alt="TaskFlow Logo" className="h-8 w-8 object-contain rounded-lg" /> TaskFlow
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground">
            Sign up to start organizing your tasks
          </p>
        </div>
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign up
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="w-full h-10" 
              variant="outline"
              onClick={signInWithGoogle}
              type="button"
            >
              Google
            </Button>
            <Button 
              className="w-full h-10" 
              variant="outline"
              onClick={signInWithGithub}
              type="button"
            >
              GitHub
            </Button>
            <Button 
              className="w-full h-10" 
              variant="outline"
              onClick={signInWithMicrosoft}
              type="button"
            >
              Microsoft
            </Button>
            <Button 
              className="w-full h-10" 
              variant="outline"
              onClick={signInWithYahoo}
              type="button"
            >
              Yahoo
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
