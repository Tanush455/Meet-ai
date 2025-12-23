import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Using NewsAPI.org - free tier allows 1000 requests/month
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=artificial%20intelligence%20OR%20machine%20learning%20OR%20AI%20technology&sortBy=publishedAt&language=en&pageSize=8&apiKey=${process.env.NEWS_API_KEY}`,
      {
        headers: {
          'User-Agent': 'AI-Dashboard/1.0'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch news');
    }

    const formattedNews = data.articles?.map((article: any, index: number) => ({
      id: index + 1,
      title: article.title,
      description: article.description || article.content?.substring(0, 150) + '...',
      category: "AI Tech",
      time: new Date(article.publishedAt).toLocaleString(),
      readTime: Math.ceil((article.content?.length || 1000) / 1000) + " min read",
      trending: index < 2,
      image: article.urlToImage,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt
    })) || [];

    return NextResponse.json({ 
      news: formattedNews,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching AI news:', error);
    
    // Return fallback data
    return NextResponse.json({ 
      news: [
        {
          id: 1,
          title: "AI Technology Advances Continue",
          description: "Latest developments in artificial intelligence show promising results across multiple sectors.",
          category: "AI Tech",
          time: new Date().toLocaleString(),
          readTime: "5 min read",
          trending: true,
          image: null,
          url: "#",
          source: "Tech News",
          publishedAt: new Date().toISOString()
        }
      ],
      success: false,
      error: 'Failed to fetch live news - showing demo data'
    });
  }
}
