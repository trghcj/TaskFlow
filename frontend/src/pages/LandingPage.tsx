import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, Users, BarChart3, Zap, Shield, ArrowRight } from "lucide-react"
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
                
                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                  <Button size="lg" className="px-8 text-base h-14" asChild>
                    <Link to="/signup">Join and start managing <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
                  <div className="p-4 flex flex-col gap-4 h-full bg-background">
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
        <section className="border-t bg-secondary/10 py-24" id="features">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to succeed</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
                Powerful features designed to help your team move faster and stay aligned.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-4 p-8 rounded-3xl bg-background border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Plan your day</h3>
                <p className="text-muted-foreground">Organize tasks, create subtasks, and prioritize what matters most to you today.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-3xl bg-background border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Stay on track</h3>
                <p className="text-muted-foreground">Set due dates, receive email reminders, and never miss a critical deadline again.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-3xl bg-background border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Work together</h3>
                <p className="text-muted-foreground">Collaborate with your team in real-time. Share lists and assign tasks seamlessly.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-3xl bg-background border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Track progress</h3>
                <p className="text-muted-foreground">See your productivity trends with beautiful Recharts analytics and get better daily.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-3xl bg-background border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-muted-foreground">Built on modern web technologies ensuring snappy navigation and instant updates.</p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-3xl bg-background border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure by Default</h3>
                <p className="text-muted-foreground">Your data is protected with enterprise-grade security and authentication.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources / How it Works */}
        <section className="py-24" id="resources">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for modern workflows</h2>
                <p className="text-lg text-muted-foreground">
                  TaskFlow isn't just another checklist. It's a comprehensive platform that adapts to how you want to work. From simple to-dos to complex project management.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                    <span className="font-medium">Sign up in seconds with Google or Email</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                    <span className="font-medium">Create custom task boards and lists</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                    <span className="font-medium">Invite your team and start collaborating</span>
                  </li>
                </ul>
              </div>
              <div className="relative aspect-square sm:aspect-video lg:aspect-square overflow-hidden rounded-3xl bg-secondary/30 border shadow-inner flex items-center justify-center p-8">
                 {/* Abstract representation of workflow */}
                 <div className="w-full max-w-sm space-y-4">
                   <div className="h-16 rounded-xl bg-background border shadow-sm p-4 flex items-center gap-4 transform transition-transform hover:scale-105">
                     <div className="h-6 w-6 rounded border-2 border-muted-foreground/30" />
                     <div className="h-4 flex-1 rounded bg-muted" />
                   </div>
                   <div className="h-16 rounded-xl bg-background border shadow-sm p-4 flex items-center gap-4 transform transition-transform hover:scale-105 translate-x-4">
                     <div className="h-6 w-6 rounded border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center">
                       <CheckCircle2 className="h-4 w-4" />
                     </div>
                     <div className="h-4 flex-1 rounded bg-muted line-through opacity-50" />
                   </div>
                   <div className="h-16 rounded-xl bg-background border shadow-sm p-4 flex items-center gap-4 transform transition-transform hover:scale-105 -translate-x-2">
                     <div className="h-6 w-6 rounded border-2 border-muted-foreground/30" />
                     <div className="h-4 flex-1 rounded bg-muted" />
                     <div className="h-6 w-16 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center">URGENT</div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="rounded-3xl bg-primary p-10 md:p-16 text-center text-primary-foreground shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <CheckCircle2 className="h-64 w-64" />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Ready to boost your productivity?</h2>
                <p className="text-primary-foreground/80 max-w-[600px] mx-auto text-lg">
                  Join thousands of users who are already managing their tasks better with TaskFlow.
                </p>
                <Button size="lg" variant="secondary" className="px-8 mt-4 text-base h-14" asChild>
                  <Link to="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-2 text-primary font-bold text-xl">
              <img src="/taskflow_icon.png" alt="TaskFlow Logo" className="h-8 w-8 object-contain rounded-lg" /> TaskFlow
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
