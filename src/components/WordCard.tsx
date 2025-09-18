import { useState } from "react";
import { Heart, Copy, Share2, Volume2, Image } from "lucide-react";
import { Button } from "./ui/button-custom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WordData {
  word: string;
  phonetic?: string;
  definitions: Array<{
    partOfSpeech: string;
    meaning: string;
    example?: string;
  }>;
  synonyms?: string[];
  antonyms?: string[];
  audioUrl?: string;
}

interface WordCardProps {
  wordData: WordData;
  className?: string;
}

export function WordCard({ wordData, className }: WordCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wordData.word);
      toast({
        title: "Copiado!",
        description: `"${wordData.word}" foi copiada para a área de transferência.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a palavra.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Definição de "${wordData.word}"`,
          text: `${wordData.word}: ${wordData.definitions[0]?.meaning}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      const shareText = `${wordData.word}: ${wordData.definitions[0]?.meaning}\n\nVia Dicionário Interativo`;
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Link copiado!",
          description: "Definição copiada para compartilhar.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível compartilhar.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `"${wordData.word}" ${isFavorited ? 'foi removida' : 'foi adicionada'} aos favoritos.`,
    });
  };

  const handlePlayAudio = () => {
    if (wordData.audioUrl) {
      setIsPlayingAudio(true);
      const audio = new Audio(wordData.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPlayingAudio(false);
        toast({
          title: "Erro",
          description: "Não foi possível reproduzir o áudio.",
          variant: "destructive",
        });
      };
      audio.play();
    } else {
      // Simulate pronunciation (in a real app, you'd integrate with a TTS service)
      toast({
        title: "Pronúncia",
        description: `${wordData.word} ${wordData.phonetic || ''}`,
      });
    }
  };

  return (
    <div className={cn("bg-card rounded-xl shadow-card card-hover p-6 animate-fade-in", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            {wordData.word}
          </h1>
          {wordData.phonetic && (
            <p className="text-muted-foreground text-lg font-mono">
              {wordData.phonetic}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="audio"
            onClick={handlePlayAudio}
            disabled={isPlayingAudio}
            title="Ouvir pronúncia"
          >
            <Volume2 className={cn("h-4 w-4", isPlayingAudio && "animate-pulse")} />
          </Button>
          
          <Button
            variant="copy"
            onClick={handleCopy}
            title="Copiar palavra"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="favorite"
            onClick={handleFavorite}
            data-favorited={isFavorited}
            title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
          </Button>
          
          <Button
            variant="share"
            onClick={handleShare}
            title="Compartilhar"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Definitions */}
      <div className="space-y-6">
        {wordData.definitions.map((definition, index) => (
          <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="bg-secondary/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {definition.partOfSpeech}
                </span>
              </div>
              
              <p className="text-foreground text-lg leading-relaxed mb-3">
                {definition.meaning}
              </p>
              
              {definition.example && (
                <div className="bg-accent-light/50 rounded-md p-3 border-l-4 border-accent">
                  <p className="text-accent-foreground italic">
                    <span className="font-medium">Exemplo:</span> "{definition.example}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Synonyms and Antonyms */}
      {(wordData.synonyms?.length || wordData.antonyms?.length) && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid md:grid-cols-2 gap-6">
            {wordData.synonyms?.length && (
              <div className="animate-scale-in">
                <h3 className="font-serif font-semibold text-lg text-foreground mb-3">
                  Sinônimos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordData.synonyms.map((synonym, index) => (
                    <span
                      key={index}
                      className="bg-accent-light text-accent-foreground px-3 py-1 rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {wordData.antonyms?.length && (
              <div className="animate-scale-in">
                <h3 className="font-serif font-semibold text-lg text-foreground mb-3">
                  Antônimos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordData.antonyms.map((antonym, index) => (
                    <span
                      key={index}
                      className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm hover:bg-warning hover:text-warning-foreground transition-colors cursor-pointer"
                    >
                      {antonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}