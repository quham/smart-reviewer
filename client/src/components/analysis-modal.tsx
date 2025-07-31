import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/lib/types";
import { Brain, CheckCircle, Clock, X } from "lucide-react";

interface AnalysisModalProps {
  article: NewsArticle | null;
  isAnalyzing: boolean;
  onClose: () => void;
}

export default function AnalysisModal({ article, isAnalyzing, onClose }: AnalysisModalProps) {
  if (!article && !isAnalyzing) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>AI Analysis in Progress</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Brain className={`text-2xl text-primary ${isAnalyzing ? 'animate-pulse' : ''}`} />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Analyzing Article</h4>
            <p className="text-gray-600 mb-4">Our AI is generating a summary and performing sentiment analysis...</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-gray-700">Article content extracted</span>
              </div>
              <div className="flex items-center space-x-3">
                {isAnalyzing ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                <span className="text-sm text-gray-700">Generating AI summary...</span>
              </div>
              <div className="flex items-center space-x-3">
                {isAnalyzing ? (
                  <Clock className="w-5 h-5 text-gray-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                <span className="text-sm text-gray-500">Performing sentiment analysis...</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
