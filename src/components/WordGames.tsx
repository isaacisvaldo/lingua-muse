import { useState } from "react";
import { Shuffle, Image, Gamepad2, Trophy } from "lucide-react";
import { Button } from "./ui/button-custom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WordGamesProps {
  word: string;
  synonyms?: string[];
  className?: string;
}

export function WordGames({ word, synonyms = [], className }: WordGamesProps) {
  const [currentGame, setCurrentGame] = useState<'anagram' | 'synonym' | 'image' | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  // Anagram game
  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const [scrambledWord] = useState(scrambleWord(word));

  const checkAnagram = () => {
    if (userAnswer.toLowerCase() === word.toLowerCase()) {
      setScore(score + 10);
      setGameCompleted(true);
      toast({
        title: "Parabéns! 🎉",
        description: "Você resolveu o anagrama!",
      });
    } else {
      toast({
        title: "Tente novamente",
        description: "A palavra não está correta.",
        variant: "destructive",
      });
    }
  };

  // Synonym matching game
  const [randomSynonyms] = useState(() => {
    if (synonyms.length < 2) return [];
    const shuffled = [...synonyms].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  });

  const checkSynonym = (selectedSynonym: string) => {
    if (synonyms.includes(selectedSynonym)) {
      setScore(score + 5);
      toast({
        title: "Correto! ✅",
        description: `"${selectedSynonym}" é mesmo um sinônimo!`,
      });
    }
  };

  const generateWordImage = () => {
    // In a real app, this would generate or fetch an image
    toast({
      title: "Imagem Gerada! 🖼️",
      description: "Em breve você poderá ver imagens relacionadas à palavra!",
    });
  };

  return (
    <div className={cn("bg-card rounded-xl p-6 shadow-card", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Gamepad2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground">
            Jogos de Palavras
          </h3>
          <p className="text-muted-foreground text-sm">
            Teste seus conhecimentos de forma divertida
          </p>
        </div>
        {score > 0 && (
          <div className="ml-auto flex items-center gap-2 text-warning">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">{score} pontos</span>
          </div>
        )}
      </div>

      {!currentGame && (
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentGame('anagram')}
            className="p-6 h-auto flex-col gap-3 hover:bg-primary/10"
          >
            <Shuffle className="h-8 w-8 text-primary" />
            <div className="text-center">
              <p className="font-medium">Anagrama</p>
              <p className="text-sm text-muted-foreground">
                Reorganize as letras
              </p>
            </div>
          </Button>

          {synonyms.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => setCurrentGame('synonym')}
              className="p-6 h-auto flex-col gap-3 hover:bg-accent/10"
            >
              <Gamepad2 className="h-8 w-8 text-accent" />
              <div className="text-center">
                <p className="font-medium">Sinônimos</p>
                <p className="text-sm text-muted-foreground">
                  Encontre palavras similares
                </p>
              </div>
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => {
              setCurrentGame('image');
              generateWordImage();
            }}
            className="p-6 h-auto flex-col gap-3 hover:bg-warning/10"
          >
            <Image className="h-8 w-8 text-warning" />
            <div className="text-center">
              <p className="font-medium">Imagem</p>
              <p className="text-sm text-muted-foreground">
                Visualize a palavra
              </p>
            </div>
          </Button>
        </div>
      )}

      {/* Anagram Game */}
      {currentGame === 'anagram' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-center mb-2 text-muted-foreground">
              Reorganize as letras para formar a palavra:
            </p>
            <p className="text-center text-2xl font-mono font-bold tracking-widest text-primary">
              {scrambledWord.toUpperCase()}
            </p>
          </div>
          
          {!gameCompleted && (
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                onKeyPress={(e) => e.key === 'Enter' && checkAnagram()}
              />
              <Button onClick={checkAnagram} variant="hero">
                Verificar
              </Button>
            </div>
          )}
          
          {gameCompleted && (
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-success font-medium">
                Parabéns! A palavra era: <strong>{word}</strong>
              </p>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentGame(null);
              setUserAnswer('');
              setGameCompleted(false);
            }}
          >
            Voltar aos jogos
          </Button>
        </div>
      )}

      {/* Synonym Game */}
      {currentGame === 'synonym' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground mb-2">
              Clique nos sinônimos da palavra:
            </p>
            <p className="text-xl font-serif font-bold text-foreground">
              {word}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {randomSynonyms.map((synonym, index) => (
              <Button
                key={index}
                variant="secondary"
                onClick={() => checkSynonym(synonym)}
                className="p-3 text-left hover:bg-accent/10"
              >
                {synonym}
              </Button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setCurrentGame(null)}
          >
            Voltar aos jogos
          </Button>
        </div>
      )}

      {/* Image Game */}
      {currentGame === 'image' && (
        <div className="space-y-4 animate-fade-in text-center">
          <div className="bg-secondary/50 rounded-lg p-8">
            <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Imagem para: {word}
            </p>
            <p className="text-muted-foreground">
              Em breve, você poderá ver imagens relacionadas a esta palavra
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setCurrentGame(null)}
          >
            Voltar aos jogos
          </Button>
        </div>
      )}
    </div>
  );
}