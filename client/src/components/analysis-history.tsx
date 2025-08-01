import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalysisWithArticle } from "@/lib/types";
import { Eye, ExternalLink, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AnalysisResultsModal from "@/components/analysis-results-modal";

interface AnalysisHistoryProps {
  analyses: AnalysisWithArticle[];
  onRefetch: () => void;
}

export default function AnalysisHistory({ analyses, onRefetch }: AnalysisHistoryProps) {
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisWithArticle | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/analyses/${id}`);
      toast({
        title: "Analysis Deleted",
        description: "The analysis has been removed from your history.",
      });
      onRefetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete analysis.",
        variant: "destructive",
      });
    }
  };

  const handleViewAnalysis = (analysis: AnalysisWithArticle) => {
    setSelectedAnalysis(analysis);
    setShowAnalysisModal(true);
  };

  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    setSelectedAnalysis(null);
  };

  const handleOpenArticle = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadCSV = () => {
    if (filteredAnalyses.length === 0) {
      toast({
        title: "No Data to Download",
        description: "There are no analyses to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = [
      "Article Title",
      "Source",
      "Sentiment",
      "Confidence (%)",
      "Summary",
      "Analyzed Date",
      "Article URL"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredAnalyses.map(analysis => [
        `"${(analysis.article?.title || "Unknown Article").replace(/"/g, '""')}"`,
        `"${(analysis.article?.source?.name || "Unknown").replace(/"/g, '""')}"`,
        `"${analysis.sentiment}"`,
        analysis.confidence,
        `"${analysis.summary.replace(/"/g, '""')}"`,
        `"${new Date(analysis.createdAt).toLocaleDateString()}"`,
        `"${analysis.article?.url || ""}"`
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `analysis-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Successful",
      description: `Exported ${filteredAnalyses.length} analyses to CSV.`,
    });
  };

  const filteredAnalyses = sentimentFilter && sentimentFilter !== "all"
    ? analyses.filter(analysis => analysis.sentiment.toLowerCase() === sentimentFilter.toLowerCase())
    : analyses;

  return (
    <section className="bg-surface rounded-lg shadow-material overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Analysis History</h2>
            <p className="text-gray-600 mt-1">Previously analyzed articles and their results</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Sentiments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDownloadCSV}
              disabled={filteredAnalyses.length === 0}
              title="Download analysis history as CSV"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Article</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Analyzed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnalyses.map((analysis) => (
              <TableRow 
                key={analysis.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewAnalysis(analysis)}
              >
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {analysis.article?.title || "Unknown Article"}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {analysis.summary.substring(0, 80)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-900">
                  {analysis.article?.source?.name || "Unknown"}
                </TableCell>
                <TableCell>
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-900">
                  {analysis.confidence}%
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatTimeAgo(analysis.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAnalysis(analysis);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (analysis.article?.url) {
                          handleOpenArticle(analysis.article.url);
                        }
                      }}
                      disabled={!analysis.article?.url}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(analysis.id);
                      }}
                      className="text-error hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAnalyses.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No analyses found. Start by searching and analyzing some articles!
        </div>
      )}

      {filteredAnalyses.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(filteredAnalyses.length, 10)}</span> of <span className="font-medium">{filteredAnalyses.length}</span> results
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Modal */}
      <AnalysisResultsModal
        analysis={selectedAnalysis}
        isOpen={showAnalysisModal}
        onClose={closeAnalysisModal}
        title="Analysis Details"
      />
    </section>
  );
}
