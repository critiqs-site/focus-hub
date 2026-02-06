import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [step, setStep] = useState<"welcome" | "auth">("welcome");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Welcome back! 🎉");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Try logging in.");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Account created! Check your email to verify.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Welcome screen
  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-bounce-slow" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-bounce-slow" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          {/* Greeting */}
          <div className="animate-fade-in mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Welcome! <span className="inline-block animate-wave">👋</span>
            </h1>
          </div>

          {/* Character illustration area */}
          <div className="relative h-64 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Cute character with speech bubble */}
            <div className="absolute top-0 right-8 bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-sm shadow-lg animate-bounce-gentle">
              <span className="font-semibold">Let's Start! ✨</span>
            </div>
            
            {/* Simple cute character using CSS */}
            <div className="relative mx-auto w-40 h-48 mt-8">
              {/* Body */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-32 bg-gradient-to-b from-secondary to-secondary/80 rounded-t-3xl border-2 border-border" />
              {/* Head */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-primary/30 to-primary/20 rounded-full border-2 border-primary/40">
                {/* Hair */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-14 bg-secondary rounded-t-full" />
                {/* Eyes */}
                <div className="absolute top-10 left-4 w-3 h-3 bg-secondary rounded-full animate-blink" />
                <div className="absolute top-10 right-4 w-3 h-3 bg-secondary rounded-full animate-blink" />
                {/* Smile */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-8 h-4 border-b-2 border-secondary rounded-b-full" />
              </div>
              {/* Arm waving */}
              <div className="absolute top-20 -right-4 w-16 h-4 bg-primary/30 rounded-full origin-left animate-wave-arm border border-primary/40" />
            </div>
          </div>

          {/* Question */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-lg text-muted-foreground mb-2">Are you ready</p>
            <p className="text-2xl font-bold text-foreground mb-8">
              to build some habits?
            </p>
          </div>

          {/* Continue button */}
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Button
              onClick={() => setStep("auth")}
              className="w-full max-w-xs h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105 group"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Decorative dots */}
          <div className="flex justify-center gap-2 mt-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
      </div>
    );
  }

  // Auth form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => setStep("welcome")}
          className="mb-4 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 animate-fade-in"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-lg shadow-primary/25 animate-bounce-gentle">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome Back!" : "Join Us!"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Great to see you again ✨"
              : "Start your habit journey today 🚀"}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 animate-slide-up rounded-3xl" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary/50 border-primary/20 focus:border-primary transition-colors rounded-xl"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-secondary/50 border-primary/20 focus:border-primary transition-colors pr-12 rounded-xl"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] rounded-xl group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-semibold text-primary">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          🔒 Your data is encrypted and stored securely
        </p>
      </div>
    </div>
  );
};

export default Auth;