import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield, Lock, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 mb-4">
            <KeyRound className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            VaultX Password Manager
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Securely store and manage all your passwords in one encrypted vault. 
            Access your credentials anywhere, anytime.
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Get Started
              <KeyRound className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">
                Your passwords are encrypted and secured with industry-standard protocols.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <Lock className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Private & Secure</h3>
              <p className="text-sm text-muted-foreground">
                Only you can access your vault. We never see your passwords.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <Zap className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Quick Access</h3>
              <p className="text-sm text-muted-foreground">
                Find and copy your credentials instantly with smart search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
