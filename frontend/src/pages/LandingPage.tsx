import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Calendar, Users, BarChart3, Star, Check, CheckSquare } from "lucide-react"
import { Link } from "react-router-dom"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32">
          {/* Soft peach background accent */}
          <div className="absolute top-0 right-0 -z-10 h-[600px] w-[800px] rounded-full bg-secondary/50 blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4" />
          
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl/none">
                    Organize work. <br className="hidden sm:block" />
                    <span className="text-foreground">Get things done.</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
                    TaskFlow is a beautifully simple task management app to help you plan, focus, and achieve more every day.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-muted-foreground ml-2">128K+ reviews</span>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="px-8 text-base h-14" asChild>
                    <Link to="/signup">Start for free</Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="px-8 text-base h-14 gap-2">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* App Preview Mockup */}
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none relative">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-card shadow-2xl relative">
                  <div className="flex h-full flex-col">
                    <div className="flex h-12 items-center border-b px-4 gap-4">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                      </div>
                      <div className="h-4 w-32 rounded bg-muted mx-auto" />
                    </div>
                    <div className="flex flex-1 p-4 gap-4">
                      <div className="w-48 hidden sm:flex flex-col gap-2">
                        <div className="h-8 rounded bg-primary/10 w-full" />
                        <div className="h-8 rounded bg-muted w-3/4" />
                        <div className="h-8 rounded bg-muted w-5/6" />
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="h-10 rounded-lg bg-muted w-full" />
                        <div className="h-24 rounded-xl border bg-card shadow-sm p-4 flex flex-col gap-2">
                           <div className="h-4 w-1/2 rounded bg-foreground/80" />
                           <div className="h-3 w-1/3 rounded bg-muted-foreground/50" />
                        </div>
                        <div className="h-24 rounded-xl border bg-card shadow-sm p-4 flex flex-col gap-2">
                           <div className="h-4 w-2/3 rounded bg-foreground/80" />
                           <div className="h-3 w-1/4 rounded bg-muted-foreground/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile mockup floating */}
                <div className="absolute -bottom-10 -right-10 w-[200px] h-[400px] rounded-[2rem] border-4 border-foreground/10 bg-card shadow-2xl hidden md:block overflow-hidden">
                  <div className="p-4 flex flex-col gap-4 h-full">
                     <div className="h-8 w-8 rounded-full bg-primary/20 mb-2" />
                     <div className="h-6 w-3/4 rounded bg-foreground/90" />
                     <div className="space-y-3 mt-4">
                       <div className="h-12 w-full rounded-lg border flex items-center px-3 gap-3">
                         <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                         <div className="h-3 w-1/2 rounded bg-foreground/70" />
                       </div>
                       <div className="h-12 w-full rounded-lg border flex items-center px-3 gap-3">
                         <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                         <div className="h-3 w-2/3 rounded bg-foreground/70" />
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-white py-24" id="features">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-secondary/30 transition-colors hover:bg-secondary/50">
                <div className="rounded-xl bg-white p-3 shadow-sm border text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Plan your day</h3>
                <p className="text-muted-foreground">Organize tasks and prioritize what matters most to you.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-secondary/30 transition-colors hover:bg-secondary/50">
                <div className="rounded-xl bg-white p-3 shadow-sm border text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Stay on track</h3>
                <p className="text-muted-foreground">Set due dates and never miss a deadline again.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-secondary/30 transition-colors hover:bg-secondary/50">
                <div className="rounded-xl bg-white p-3 shadow-sm border text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Work together</h3>
                <p className="text-muted-foreground">Collaborate with your team in real-time seamlessly.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-secondary/30 transition-colors hover:bg-secondary/50">
                <div className="rounded-xl bg-white p-3 shadow-sm border text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Track progress</h3>
                <p className="text-muted-foreground">See your productivity trends and get better daily.</p>
              </div>
            </div>
          </div>
        </section>


      </main>

      <footer className="border-t bg-white py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-2 text-primary font-bold text-xl">
              <CheckSquare className="h-6 w-6" /> TaskFlow
            </div>
            <p className="text-sm text-muted-foreground">
              Helping you plan, focus, and achieve more every day.
            </p>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
