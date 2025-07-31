import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Info } from "lucide-react";

interface SearchSectionProps {
  onSearch: (query: string, category?: string) => void;
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchCategory = category === "all" || category === "" ? undefined : category;
      onSearch(query.trim(), searchCategory);
    }
  };

  return (
    <section className="bg-surface rounded-lg shadow-material p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Search News Articles</h2>
        <p className="text-gray-600">Find recent articles to analyze with AI-powered summarization and sentiment analysis</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              Search Keywords
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="search-query"
                placeholder="Enter keywords (e.g., artificial intelligence, climate change)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          
          <div className="sm:w-48">
            <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 flex items-center">
            <Info className="w-4 h-4 mr-1" />
            Powered by GNews API - 100 requests/day limit
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-3">
            <Search className="w-4 h-4 mr-2" />
            Search Articles
          </Button>
        </div>
      </form>
    </section>
  );
}
