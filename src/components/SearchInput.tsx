import { Search, X } from "lucide-react";
import { Button } from "./ui/button-custom";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
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
  className 
}: SearchInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" 
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "w-full pl-12 pr-20 py-4 text-lg bg-card border border-border rounded-xl",
            "search-input shadow-card",
            "placeholder:text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isLoading && "animate-pulse"
          )}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
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
            onClick={onSearch}
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
    </div>
  );
}