// src/components/SearchInput.tsx
import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, BookOpen } from "lucide-react";
import { Button } from "./ui/button-custom";
import { cn } from "@/lib/utils";
import { getWordSuggestions, SuggestionItem } from "@/services/words/words.service";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term?: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Digite uma palavra...",
  isLoading = false,
  className,
}: SearchInputProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ========= BUSCA SUGESTÕES =========
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (value.trim().length >= 2) {
        setLoadingSuggestions(true);
        try {
          const data = await getWordSuggestions({ q: value.trim() });
          setSuggestions(data);
          setShowDropdown(true);
        } catch (err) {
          console.error("Erro nas sugestões:", err);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // ========= CLIQUE FORA =========
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ========= HANDLERS =========
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      setShowDropdown(false);
      onSearch();
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
    onChange(item.term);
    setShowDropdown(false);
    onSearch(item.term);
    inputRef.current?.focus();
  };

  const handleSearchClick = () => {
    if (value.trim()) {
      setShowDropdown(false);
      onSearch();
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => value.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          disabled={isLoading}
          autoComplete="off"
          className={cn(
            "w-full pl-12 pr-36 py-4 text-lg bg-card border border-border rounded-xl",
            "shadow-card placeholder:text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            isLoading && "animate-pulse"
          )}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              variant="icon"
              size="sm"
              onClick={handleClear}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="hero"
            onClick={handleSearchClick}
            disabled={!value.trim() || isLoading}
            className="h-8 px-4 text-sm"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              "Buscar"
            )}
          </Button>
        </div>
      </div>

      {/* ========= DROPDOWN ========= */}
      {showDropdown && (suggestions.length > 0 || loadingSuggestions) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {loadingSuggestions ? (
            <div className="flex items-center gap-3 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Buscando sugestões...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma sugestão encontrada</p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                      <span className="font-medium truncate">{item.term}</span>
                    </div>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      ID: {item.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}