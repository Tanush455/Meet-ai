"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, RefreshCw, ExternalLink, Globe, Clock, BookOpen, ChevronRight, Zap } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  time: string;
  readTime: string;
  trending: boolean;
  image: string | null;
  url: string;
  source: string;
  publishedAt: string;
}
interface NewsResponse {
  news: NewsItem[];
  success: boolean;
  error?: string;
}

export default function HomeView() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useQuery<NewsResponse>({
    queryKey: ["aiNewsOnly"],
    queryFn: async () => {
      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  const aiNews = newsData?.news ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI News</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetchNews()}
              disabled={newsLoading}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${newsLoading ? "animate-spin" : ""}`} />
            </button>
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Powered by NewsAPI <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {newsError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              {newsData?.error || "Failed to load live news. Showing demo data."}
            </p>
          </div>
        )}

        {newsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading AI news…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {aiNews.map((news) => (
              <div
                key={news.id}
                className="group border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-200 bg-gradient-to-r from-white to-gray-50"
                onMouseEnter={() => setHoveredCard(`news-${news.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => news.url !== "#" && window.open(news.url, "_blank")}
              >
                <div className="flex gap-4">
                  <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    {news.image ? (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const sibling = target.nextElementSibling as HTMLElement;
                          if (sibling) sibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {news.category}
                          </span>
                          {news.trending && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Trending
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{news.source}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{news.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {news.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {news.readTime}
                          </span>
                        </div>
                      </div>
                      {hoveredCard === `news-${news.id}` && (
                        <ChevronRight className="w-5 h-5 text-blue-500 transform translate-x-0 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {aiNews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No AI news found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
