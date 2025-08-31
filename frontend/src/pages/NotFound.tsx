import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="glass-card p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold gradient-text">404</h1>
          <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Your digital twin couldn't locate this page in the system.
          </p>
        </div>
        
        <Button asChild className="neon-glow">
          <a href="/" className="inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
