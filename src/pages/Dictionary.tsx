// src/pages/Dictionary.tsx

import { useState, useEffect } from "react";
import { BookOpen, User, LogOut, Search, Volume2 } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { WordCard } from "@/components/WordCard";
import { WordGames } from "@/components/WordGames";
import dictionaryIcon from "@/assets/dictionary-icon.jpg";
import { useAuth } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { searchWords, getWordByTerm, type Word } from "@/services/words/words.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button-custom";

export default function Dictionary() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = async (termOverride?: string) => {
    const term = termOverride || searchTerm.trim();
    if (!term) return;

    setIsLoading(true);
    setCurrentGame(null);
    setSelectedWord(null);

    try {
      const response = await searchWords({
        query: term,
        page,
        limit,
      });

      setResults(response.results);
      setTotal(response.total);

      if (response.results.length === 1) {
        setSelectedWord(response.results[0]);
      } else if (response.results.length === 0) {
        // Fallback: busca exata com criação automática
        const exactWord = await getWordByTerm(term);
        setSelectedWord(exactWord);
        setResults([exactWord]);
        setTotal(1);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce na busca
  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        setPage(1);
        handleSearch();
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSelectedWord(null);
      setTotal(0);
    }
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
    setCurrentGame(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extrai sinônimos como string[]
  const getSynonymsArray = (word: Word): string[] => {
    return word.synonyms.map(s => s.term);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={dictionaryIcon} alt="Dicionário" className="w-10 h-10 rounded-lg shadow-sm" />
              <h1 className="text-2xl font-serif font-bold text-gradient-primary">
                Dicionário Interativo
              </h1>
            </div>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Descubra o significado das palavras
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Definições completas, exemplos reais, sinônimos e pronúncia.
          </p>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={() => handleSearch()}
            isLoading={isLoading}
            placeholder="Buscar palavra..."
            className="mx-auto max-w-2xl"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-40 mb-3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Resultados */}
        {!isLoading && results.length > 0 && (
          <>
            {/* Palavra selecionada */}
            {selectedWord && (
              <div className="max-w-4xl mx-auto mb-12">
                <WordCard wordData={selectedWord} />
                <WordGames
                  word={selectedWord.term}
                  synonyms={getSynonymsArray(selectedWord)}
                  currentGame={currentGame}
                  onGameChange={setCurrentGame}
                />
              </div>
            )}

            {/* Lista de resultados */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Search className="w-6 h-6" />
                {total} resultado{total > 1 ? "s" : ""} para "{searchTerm}"
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((word) => (
                  <Card
                    key={word.id}
                    className={`cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] border-2 ${selectedWord?.id === word.id ? "border-primary shadow-lg" : "border-transparent"
                      }`}
                    onClick={() => handleWordClick(word)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center justify-between">
                        <span className="truncate">{word.term}</span>
                        {word.audioUrl && (
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </CardTitle>
                      {word.phonetic && (
                        <p className="text-sm text-muted-foreground italic">{word.phonetic}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {word.definitions.slice(0, 2).map((def) => (
                          <div key={def.id}>
                            <Badge variant="secondary" className="mb-1">
                              {def.partOfSpeech}
                            </Badge>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {def.meaning}
                            </p>
                          </div>
                        ))}
                        {word.definitions.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{word.definitions.length - 2} definição{word.definitions.length > 3 ? "s" : ""}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {word.synonyms.slice(0, 4).map((syn) => (
                            <Badge key={syn.id} variant="outline" className="text-xs">
                              {syn.term}
                            </Badge>
                          ))}
                          {word.synonyms.length > 4 && (
                            <span className="text-xs text-muted-foreground">
                              +{word.synonyms.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginação */}
              {total > limit && (
                <div className="flex justify-center gap-3 mt-12">
                  <Button
                    variant="outline"  // ← Agora é válido!
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Anterior
                  </Button>

                  <span className="flex items-center px-4 text-sm font-medium">
                    Página {page} de {Math.ceil(total / limit)}
                  </span>

                  <Button
                    variant="outline"  // ← Funciona!
                    disabled={page >= Math.ceil(total / limit)}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Estado vazio */}
        {!isLoading && !selectedWord && searchTerm && results.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Nenhuma palavra encontrada</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Não encontramos "{searchTerm}". Tente outra grafia ou adicione você mesmo!
            </p>
          </div>
        )}

        {/* Estado inicial */}
        {!searchTerm && results.length === 0 && (
          <div className="text-center py-20 max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-12 shadow-xl">
              <BookOpen className="h-20 w-20 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-serif font-bold mb-4">Bem-vindo ao Dicionário</h3>
              <p className="text-lg text-muted-foreground">
                Digite uma palavra acima para explorar significados, exemplos e sinônimos.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card/30 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Dicionário Interativo © 2025 - Feito com ❤️ para quem ama palavras
          </p>
        </div>
      </footer>
    </div>
  );
}