import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/lib/types";
import { Brain } from "lucide-react";

interface ArticleCardProps {
  article: NewsArticle;
  onAnalyze: () => void;
}

export default function ArticleCard({ article, onAnalyze }: ArticleCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <article className="bg-surface rounded-lg shadow-material overflow-hidden hover:shadow-material-lg transition-shadow">
      {article.image && (
        <img 
          src={article.image}
          alt="News article thumbnail"
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {article.source.name}
          </Badge>
          <span className="text-gray-500 text-xs">
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {article.source.name}
          </div>
          <Button 
            onClick={onAnalyze}
            className="bg-primary hover:bg-primary-dark text-white"
            size="sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div>
    </article>
  );
}
