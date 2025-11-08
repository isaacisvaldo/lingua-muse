import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button-custom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, Trophy } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
      
      <Card className="w-full max-w-md relative z-10 animate-bounce-in shadow-hover border-2">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1 animate-scale-in shadow-lg">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <img 
                src="/src/assets/dictionary-icon.jpg" 
                alt="Dictionary" 
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardTitle className="text-4xl text-gradient-primary">
              Bem-vindo ao Dicionário
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Explore definições, sinônimos e jogos de palavras de forma interativa e divertida
            </CardDescription>
          </div>

          {/* Features highlight */}
          <div className="grid grid-cols-3 gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-foreground">Definições</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-xs font-medium text-foreground">Sinônimos</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-warning/5 hover:bg-warning/10 transition-colors">
              <Trophy className="w-6 h-6 text-warning" />
              <span className="text-xs font-medium text-foreground">Jogos</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            variant="hero" 
            className="w-full group relative overflow-hidden"
            onClick={() => navigate("/login")}
          >
            <span className="relative z-10">Fazer Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full hover:scale-105 transition-transform"
            onClick={() => navigate("/signup")}
          >
            Criar Conta
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/dictionary")}
          >
            Continuar sem conta →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
