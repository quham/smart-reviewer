import { useState } from "react";
import SearchSection from "@/components/search-section";
import ArticleCard from "@/components/article-card";
import AnalysisModal from "@/components/analysis-modal";
import AnalysisResults from "@/components/analysis-results";
import AnalysisHistory from "@/components/analysis-history";
import { useQuery } from "@tanstack/react-query";
import { NewsArticle, AnalysisResult } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Newspaper, Database } from "lucide-react";

export default function Home() {
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  const { data: analysesData, refetch: refetchAnalyses } = useQuery({
    queryKey: ["/api/analyses"],
    select: (data: any) => data.analyses || [],
  });

  const handleSearch = async (query: string, category?: string) => {
    setIsSearching(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category }),
      });

      if (!response.ok) {
        throw new Error("Failed to search articles");
      }

      const data = await response.json();
      setSearchResults(data.articles || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze article");
      }

      const data = await response.json();
      setCurrentAnalysis(data.analysis);
      refetchAnalyses();
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setIsAnalyzing(false);
  };

  const analysisCount = analysesData?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-material sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Newspaper className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Reviewer</h1>
                <p className="text-sm text-gray-600">AI-Powered News Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Database className="w-4 h-4" />
              <span>{analysisCount} Articles Analyzed</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Section */}
        <SearchSection onSearch={handleSearch} />

        {/* Loading State */}
        {isSearching && (
          <section className="bg-surface rounded-lg shadow-material p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Searching Articles...</h3>
            <p className="text-gray-600">Fetching the latest news from GNews API</p>
          </section>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <div className="text-sm text-gray-600">
                {searchResults.length} articles found
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {searchResults.map((article, index) => (
                <ArticleCard
                  key={`${article.url}-${index}`}
                  article={article}
                  onAnalyze={() => handleAnalyze(article)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Analysis Modal */}
        {(selectedArticle || isAnalyzing) && (
          <AnalysisModal
            article={selectedArticle}
            isAnalyzing={isAnalyzing}
            onClose={closeModal}
          />
        )}

        {/* Analysis Results */}
        {currentAnalysis && (
          <AnalysisResults analysis={currentAnalysis} />
        )}

        {/* Analysis History */}
        <AnalysisHistory analyses={analysesData || []} onRefetch={refetchAnalyses} />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Newspaper className="text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Reviewer</h3>
                <p className="text-sm text-gray-600">AI-Powered News Analysis Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-success" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Newspaper className="h-4 w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; 2024 Smart Reviewer. Built with React and Express. Powered by GNews API and OpenAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
