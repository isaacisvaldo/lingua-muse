import { useState } from "react";
import { Heart, Copy, Share2, Volume2, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button-custom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { type Word } from "@/services/words/words.service";

interface WordCardProps {
  wordData: Word;
  className?: string;
}

export function WordCard({ wordData, className }: WordCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [openDefinitions, setOpenDefinitions] = useState<number[]>([]);
  const { toast } = useToast();

  const toggleDefinition = (id: number) => {
    setOpenDefinitions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wordData.term);
      toast({
        title: "Copiado!",
        description: `"${wordData.term}" foi copiada para a área de transferência.`,
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível copiar.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const firstMeaning = wordData.definitions[0]?.meaning || "";
    const shareData = {
      title: `Definição de "${wordData.term}"`,
      text: `${wordData.term}: ${firstMeaning}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Usuário cancelou
      }
    } else {
      const text = `${shareData.text}\n\nVia Dicionário Interativo`;
      try {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copiado para compartilhar!", description: text });
      } catch {
        toast({ title: "Erro", description: "Não foi possível copiar.", variant: "destructive" });
      }
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removido" : "Adicionado",
      description: `"${wordData.term}" ${isFavorited ? "removido" : "adicionado"} aos favoritos!`,
    });
  };

  const handlePlayAudio = () => {
    if (wordData.audioUrl) {
      setIsPlayingAudio(true);
      const audio = new Audio(wordData.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPlayingAudio(false);
        toast({ title: "Erro", description: "Áudio não disponível.", variant: "destructive" });
      };
      audio.play().catch(() => setIsPlayingAudio(false));
    } else if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(wordData.term);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Pronúncia",
        description: wordData.phonetic ? `${wordData.term} ${wordData.phonetic}` : wordData.term,
      });
    }
  };

  const synonyms = wordData.synonyms.map(s => s.term);
  const antonyms = wordData.antonyms.map(a => a.term);

  return (
    <div className={cn("bg-card rounded-2xl shadow-card card-hover p-8 animate-fade-in", className)}>
      {/* Header com palavra + ações */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-5xl font-serif font-bold text-foreground mb-3">
            {wordData.term}
            {wordData.imageUrl && (
              <img
                src={wordData.imageUrl}
                alt={wordData.term}
                className="inline-block ml-4 w-20 h-20 object-cover rounded-lg shadow-md border"
              />
            )}
          </h1>
          {wordData.phonetic && (
            <p className="text-2xl text-muted-foreground font-mono italic">
              {wordData.phonetic}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="audio" size="lg" onClick={handlePlayAudio} disabled={isPlayingAudio}>
            <Volume2 className={cn("h-5 w-5", isPlayingAudio && "animate-pulse")} />
          </Button>
          <Button variant="ghost" size="lg" onClick={handleCopy} title="Copiar">
            <Copy className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleFavorite}
            data-favorited={isFavorited}
            title="Favoritar"
          >
            <Heart className={cn("h-5 w-5", isFavorited && "fill-red-500 text-red-500")} />
          </Button>
          <Button variant="ghost" size="lg" onClick={handleShare} title="Compartilhar">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Definições com Collapsible */}
      <div className="space-y-6">
        {wordData.definitions.map((def, index) => (
          <Collapsible
            key={def.id}
            open={openDefinitions.includes(def.id)}
            onOpenChange={() => toggleDefinition(def.id)}
            className="bg-secondary/20 rounded-xl overflow-hidden border border-border/50"
          >
            <CollapsibleTrigger className="w-full p-6 text-left hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm font-bold">
                    {index + 1}. {def.partOfSpeech}
                  </Badge>
                  <p className="text-lg font-medium text-foreground line-clamp-2">
                    {def.meaning}
                  </p>
                </div>
                {def.examples.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">{def.examples.length} exemplo{def.examples.length > 1 ? "s" : ""}</span>
                    {openDefinitions.includes(def.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-6 pb-6 border-t border-border/30">
              <div className="space-y-4 mt-4">
                {def.examples.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent"
                  >
                    <p className="text-foreground italic leading-relaxed">
                      "{ex.sentence}"
                    </p>
                    {ex.translation && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Tradução:</span> {ex.translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Sinônimos e Antônimos */}
      {(synonyms.length > 0 || antonyms.length > 0) && (
        <div className="mt-10 pt-8 border-t border-border/50">
          <div className="grid md:grid-cols-2 gap-8">
            {synonyms.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  Sinônimos
                  <Badge variant="outline">{synonyms.length}</Badge>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {synonyms.map((syn) => (
                    <span
                      key={syn}
                      className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all cursor-pointer"
                      onClick={() => {
                        // Opcional: buscar ao clicar
                        window.location.href = `/?q=${syn}`;
                      }}
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {antonyms.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  Antônimos
                  <Badge variant="outline">{antonyms.length}</Badge>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {antonyms.map((ant) => (
                    <span
                      key={ant}
                      className="bg-destructive/10 text-destructive border border-destructive/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      {ant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rodapé com imagem (se houver) */}
      {wordData.imageUrl && (
        <div className="mt-10 text-center">
          <img
            src={wordData.imageUrl}
            alt={wordData.term}
            className="max-w-md mx-auto rounded-xl shadow-2xl border"
          />
          <p className="text-sm text-muted-foreground mt-3">
            <ImageIcon className="inline h-4 w-4" /> Ilustração de {wordData.term}
          </p>
        </div>
      )}
    </div>
  );
}