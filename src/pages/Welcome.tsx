import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button-custom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <img 
              src="/src/assets/dictionary-icon.jpg" 
              alt="Dictionary" 
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl">Bem-vindo ao Dicionário</CardTitle>
          <CardDescription className="text-base">
            Explore definições, sinônimos e jogos de palavras de forma interativa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="hero" 
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Fazer Login
          </Button>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => navigate("/signup")}
          >
            Criar Conta
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground"
            onClick={() => navigate("/dictionary")}
          >
            Continuar sem conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
