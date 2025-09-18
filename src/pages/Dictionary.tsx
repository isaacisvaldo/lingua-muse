import { useState } from "react";
import { BookOpen } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { WordCard } from "@/components/WordCard";
import { WordGames } from "@/components/WordGames";
import dictionaryIcon from "@/assets/dictionary-icon.jpg";

// Mock data - in a real app, this would come from an API
const mockWordData = {
  word: "sabedoria",
  phonetic: "/sa.be.do'ri.a/",
  definitions: [
    {
      partOfSpeech: "substantivo feminino",
      meaning: "Qualidade daquele que possui conhecimento profundo sobre algo; discernimento para avaliar e julgar adequadamente.",
      example: "A sabedoria dos anciões é valorizada em muitas culturas."
    },
    {
      partOfSpeech: "substantivo feminino",
      meaning: "Conjunto de conhecimentos adquiridos através da experiência ou estudo.",
      example: "Sua sabedoria sobre plantas medicinais impressionava todos."
    }
  ],
  synonyms: ["conhecimento", "prudência", "discernimento", "saber", "inteligência"],
  antonyms: ["ignorância", "imprudência", "insensatez"],
  audioUrl: undefined // Would contain actual audio URL
};

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWord, setCurrentWord] = useState<typeof mockWordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setCurrentGame(null);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you'd make an API call here
      setCurrentWord({
        ...mockWordData,
        word: searchTerm.toLowerCase(),
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={dictionaryIcon} 
              alt="Dicionário" 
              className="w-10 h-10 rounded-lg shadow-sm"
            />
            <h1 className="text-2xl font-serif font-bold text-gradient-primary">
              Dicionário Interativo
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Descubra o significado das palavras
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore definições, exemplos, sinônimos e muito mais em nossa interface moderna e intuitiva.
          </p>
          
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            isLoading={isLoading}
            className="mx-auto animate-bounce-in"
          />
        </div>

        {/* Results Section */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando definições...</p>
            </div>
          </div>
        )}

        {currentWord && !isLoading && (
          <div className="max-w-4xl mx-auto space-y-8">
            {!currentGame && <WordCard wordData={currentWord} />}
            <WordGames 
              word={currentWord.word} 
              synonyms={currentWord.synonyms}
              currentGame={currentGame}
              onGameChange={setCurrentGame}
            />
          </div>
        )}

        {/* Empty State */}
        {!currentWord && !isLoading && (
          <div className="text-center py-16 max-w-2xl mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-card">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                Pronto para começar?
              </h3>
              <p className="text-muted-foreground mb-6">
                Digite uma palavra no campo de busca acima para ver sua definição, exemplos e muito mais.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="bg-primary-light rounded-lg p-3 mb-2">
                    <BookOpen className="h-6 w-6 text-primary mx-auto" />
                  </div>
                  <p className="font-medium">Definições claras</p>
                </div>
                <div className="text-center">
                  <div className="bg-accent-light rounded-lg p-3 mb-2">
                    <BookOpen className="h-6 w-6 text-accent mx-auto" />
                  </div>
                  <p className="font-medium">Exemplos práticos</p>
                </div>
                <div className="text-center">
                  <div className="bg-secondary rounded-lg p-3 mb-2">
                    <BookOpen className="h-6 w-6 text-secondary-foreground mx-auto" />
                  </div>
                  <p className="font-medium">Sinônimos</p>
                </div>
                <div className="text-center">
                  <div className="bg-warning/10 rounded-lg p-3 mb-2">
                    <BookOpen className="h-6 w-6 text-warning mx-auto" />
                  </div>
                  <p className="font-medium">Pronúncia</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Dicionário Interativo - Expandindo conhecimento através das palavras
          </p>
        </div>
      </footer>
    </div>
  );
}