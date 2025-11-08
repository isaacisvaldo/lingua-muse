// src/components/WordGames.tsx
import { useState, useCallback, useMemo } from "react";
import {
  Shuffle,
  Image as ImageIcon,
  Gamepad2,
  Trophy,
  Check,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button-custom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WordGamesProps {
  word: string;
  synonyms?: string[];
  className?: string;
  currentGame: string | null;
  onGameChange: (game: string | null) => void;
}

export function WordGames({
  word,
  synonyms = [],
  className,
  currentGame,
  onGameChange,
}: WordGamesProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  // === CHAVE PARA FORÇAR REGENERAÇÃO ===
  const [synonymGameKey, setSynonymGameKey] = useState(0);

  // === ESTADO DO JOGO ATUAL ===
  const [selectedSynonyms, setSelectedSynonyms] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  // Pool de palavras falsas
  const fakeWordsPool = [
    "felicidade", "tristeza", "alegria", "raiva", "medo", "surpresa", "nojo", "confiança",
    "esperança", "orgulho", "vergonha", "culpa", "inveja", "ciúme", "amor", "ódio",
    "paz", "guerra", "luz", "trevas", "calor", "frio", "vida", "morte",
    "rico", "pobre", "grande", "pequeno", "alto", "baixo", "rápido", "lento",
    "bonito", "feio", "novo", "velho", "fácil", "difícil", "certo", "errado",
    "abrir", "fechar", "começar", "terminar", "ganhar", "perder", "subir", "descer",
    "dia", "noite", "sol", "lua", "água", "fogo", "terra", "ar", "cão", "gato",
    "pássaro", "peixe", "casa", "carro", "comida", "bebida", "trabalho", "lazer", "amigo", "inimigo"
  ];

  // === GERA OPÇÕES FIXAS POR JOGO (só muda com a key) ===
  const synonymOptions = useMemo(() => {
    if (synonyms.length === 0) return [];

    const realShuffled = [...synonyms].sort(() => Math.random() - 0.5);
    const realCount = Math.min(2, realShuffled.length);
    const realSynonyms = realShuffled.slice(0, realCount);

    const shuffledFakes = [...fakeWordsPool].sort(() => Math.random() - 0.5);
    const fakes = shuffledFakes
      .filter((w) => !synonyms.includes(w) && w !== word.toLowerCase())
      .slice(0, 4 - realCount);

    return [...realSynonyms, ...fakes].sort(() => Math.random() - 0.5);
  }, [synonyms, word, synonymGameKey]); // ← DEPENDE DA KEY!

  // Anagrama
  const scrambleWord = (w: string) =>
    w.split("").sort(() => Math.random() - 0.5).join("");
  const [scrambledWord] = useState(scrambleWord(word));

  const checkAnagram = () => {
    if (userAnswer.toLowerCase() === word.toLowerCase()) {
      setScore((s) => s + 10);
      setGameCompleted(true);
      toast({ title: "Parabéns! 🎉", description: "Anagrama resolvido!" });
    } else {
      toast({ title: "Oops! 😅", description: "Tente novamente!", variant: "destructive" });
    }
  };

  const checkSynonym = (selected: string) => {
    if (selectedSynonyms.includes(selected) || gameOver) return;

    setSelectedSynonyms((prev) => [...prev, selected]);

    if (synonyms.includes(selected)) {
      setScore((s) => s + 8);
      toast({ title: "Correto! ✅", description: `"${selected}" é sinônimo!` });

      const allCorrect = synonymOptions
        .filter((opt) => synonyms.includes(opt))
        .every((opt) => selectedSynonyms.includes(opt) || opt === selected);

      if (allCorrect) {
        setGameOver(true);
        toast({ title: "Vitória Perfeita! 🏆", description: "Todos encontrados!" });
      }
    } else {
      setGameOver(true);
      toast({
        title: "Errado! Game Over! 💀",
        description: `"${selected}" não é sinônimo!`,
        variant: "destructive",
      });
    }
  };

  const resetSynonymGame = () => {
    setSelectedSynonyms([]);
    setGameOver(false);
    setSynonymGameKey((k) => k + 1); // ← GERA OPÇÕES NOVAS
  };

  const generateWordImage = () => {
    toast({
      title: "Imagem Gerada! 🖼️",
      description: `Em breve com IA para "${word}"!`,
    });
  };

  const correctCount = selectedSynonyms.filter((s) => synonyms.includes(s)).length;
  const wrongCount = selectedSynonyms.filter((s) => !synonyms.includes(s)).length;

  return (
    <div className={cn("bg-card rounded-xl p-6 shadow-card", className)}>
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Gamepad2 className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif font-semibold text-lg text-foreground">
            Jogos de Palavras
          </h3>
          <p className="text-muted-foreground text-sm">
            1 erro = Game Over!
          </p>
        </div>
        {score > 0 && (
          <div className="flex items-center gap-2 text-warning">
            <Trophy className="h-5 w-5" />
            <span className="font-bold text-lg">{score} pts</span>
          </div>
        )}
      </div>

      {/* MENU */}
      {!currentGame && (
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="secondary" onClick={() => onGameChange("anagram")} className="p-6 h-auto flex-col gap-3 hover:bg-primary/10 transition-all">
            <Shuffle className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold">Anagrama</p>
              <p className="text-xs text-muted-foreground">Reorganize as letras</p>
            </div>
          </Button>

          {synonyms.length > 0 && (
            <Button variant="secondary" onClick={() => onGameChange("synonym")} className="p-6 h-auto flex-col gap-3 hover:bg-accent/10 transition-all">
              <Gamepad2 className="h-10 w-10 text-accent" />
              <div className="text-center">
                <p className="font-semibold">Sinônimos</p>
                <p className="text-xs text-muted-foreground">1 erro = fim!</p>
              </div>
            </Button>
          )}

          <Button variant="secondary" onClick={() => { onGameChange("image"); generateWordImage(); }} className="p-6 h-auto flex-col gap-3 hover:bg-warning/10 transition-all">
            <ImageIcon className="h-10 w-10 text-warning" />
            <div className="text-center">
              <p className="font-semibold">Imagem</p>
              <p className="text-xs text-muted-foreground">Visualize a palavra</p>
            </div>
          </Button>
        </div>
      )}

      {/* ANAGRAMA */}
      {currentGame === "anagram" && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-secondary/50 rounded-xl p-6 text-center">
            <p className="text-muted-foreground mb-3">Descubra a palavra:</p>
            <p className="text-4xl font-bold font-mono tracking-wider text-primary">
              {scrambledWord.toUpperCase()}
            </p>
          </div>

          {!gameCompleted ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnagram()}
                placeholder="Sua resposta..."
                className="flex-1 px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoFocus
              />
              <Button onClick={checkAnagram} variant="hero" size="lg">
                Verificar
              </Button>
            </div>
          ) : (
            <div className="text-center p-6 bg-success/10 rounded-xl border-2 border-success/30">
              <Check className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-xl font-bold text-success">
                Parabéns! A palavra era <span className="text-primary">"{word}"</span>
              </p>
            </div>
          )}

          <Button variant="ghost" onClick={() => { onGameChange(null); setUserAnswer(""); setGameCompleted(false); }}>
            ← Voltar
          </Button>
        </div>
      )}

      {/* SINÔNIMOS - OPÇÕES FIXAS + BOTÃO SÓ NO FIM */}
      {currentGame === "synonym" && synonymOptions.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Encontre os sinônimos de:</p>
            <p className="text-3xl font-serif font-bold text-primary">{word}</p>
            <p className="text-sm text-destructive mt-2 font-bold">⚠️ 1 erro = GAME OVER</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {synonymOptions.map((opt) => {
              const isCorrect = synonyms.includes(opt);
              const isSelected = selectedSynonyms.includes(opt);

              return (
                <Button
                  key={opt}
                  variant="secondary"
                  disabled={isSelected || gameOver}
                  onClick={() => checkSynonym(opt)}
                  className={cn(
                    "p-6 text-lg h-auto transition-all relative overflow-hidden",
                    isSelected && isCorrect && "bg-success/20 border-2 border-success text-success",
                    isSelected && !isCorrect && "bg-destructive/20 border-2 border-destructive text-destructive",
                    gameOver && !isSelected && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <span className="relative z-10">{opt}</span>
                  {isSelected && isCorrect && <Check className="h-7 w-7 absolute top-2 right-2" />}
                  {isSelected && !isCorrect && <XCircle className="h-7 w-7 absolute top-2 right-2" />}
                </Button>
              );
            })}
          </div>

          {gameOver && (
            <div className={cn(
              "text-center p-6 rounded-xl border-4",
              wrongCount > 0 ? "bg-destructive/10 border-destructive" : "bg-success/10 border-success"
            )}>
              <h3 className="text-2xl font-bold mb-3">
                {wrongCount > 0 ? "💀 GAME OVER" : "🏆 VITÓRIA PERFEITA!"}
              </h3>
              <p className="text-lg">
                Acertos: <strong className="text-success">{correctCount}</strong> | 
                Erros: <strong className="text-destructive">{wrongCount}</strong>
              </p>
              <p className="text-xl font-bold text-primary mt-3">
                Pontuação: {score} pontos
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => onGameChange(null)}>
              ← Menu
            </Button>
            {gameOver && (
              <Button variant="hero" onClick={resetSynonymGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Jogar Novamente
              </Button>
            )}
          </div>
        </div>
      )}

      {/* IMAGEM */}
      {currentGame === "image" && (
        <div className="space-y-6 animate-fade-in text-center">
          <div className="bg-secondary/50 rounded-2xl p-12">
            <div className="bg-muted border-2 border-dashed border-border rounded-xl w-64 h-64 mx-auto flex items-center justify-center">
              <ImageIcon className="h-20 w-20 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium mt-6">Imagem para: <strong>{word}</strong></p>
            <p className="text-muted-foreground">
              Em breve com IA (DALL-E / Stable Diffusion) ⚡
            </p>
          </div>
          <Button variant="ghost" onClick={() => onGameChange(null)}>
            ← Voltar
          </Button>
        </div>
      )}
    </div>
  );
}