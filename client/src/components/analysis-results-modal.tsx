import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "@/lib/types";
import { FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResultsModalProps {
  analysis: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function AnalysisResultsModal({ 
  analysis, 
  isOpen, 
  onClose, 
  title = "Analysis Results" 
}: AnalysisResultsModalProps) {
  const { toast } = useToast();

  if (!analysis) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-success/10 text-success";
      case "negative":
        return "bg-error/10 text-error";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Article Summary</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
  
                <span>{formatTimeAgo(analysis.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Sentiment Analysis</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Overall Sentiment</span>
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Confidence Score</span>
                    <span className="font-medium">{analysis.confidence}%</span>
                  </div>
                  <Progress value={analysis.confidence} className="w-full" />
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-success/5 rounded-lg">
                    <div className="text-lg font-semibold text-success">{analysis.positiveScore}%</div>
                    <div className="text-xs text-gray-600">Positive</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-600">{analysis.neutralScore}%</div>
                    <div className="text-xs text-gray-600">Neutral</div>
                  </div>
                  <div className="text-center p-3 bg-error/5 rounded-lg">
                    <div className="text-lg font-semibold text-error">{analysis.negativeScore}%</div>
                    <div className="text-xs text-gray-600">Negative</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 