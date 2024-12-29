import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    if (!NEWS_API_KEY) {
      throw new Error('News API key is not configured');
    }

    // Get multiple categories of news
    const queries = [
      // Tech jobs and hiring news
      `https://newsapi.org/v2/everything?` +
      `q=(tech OR technology) AND (jobs OR hiring OR recruitment OR "job market")` +
      `&language=en&pageSize=20&sortBy=publishedAt`,

      // Tech innovation news
      `https://newsapi.org/v2/everything?` +
      `q=(innovation OR "artificial intelligence" OR startup OR "tech breakthrough")` +
      `&language=en&pageSize=20&sortBy=publishedAt`,

      // Major tech companies news
      `https://newsapi.org/v2/everything?` +
      `q=(Google OR Microsoft OR Apple OR Amazon OR Meta) AND (technology OR AI)` +
      `&language=en&pageSize=10&sortBy=publishedAt`
    ];

    // Add timestamp to prevent caching
    const timestamp = Date.now();
    const promises = queries.map(query => 
      fetch(`${query}&apiKey=${NEWS_API_KEY}&_=${timestamp}`, {
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }).then(res => res.json())
    );

    const results = await Promise.all(promises);
    
    // Combine all articles
    const allArticles = results.flatMap(result => result.articles || [])
      .filter((article: any) => (
        article.urlToImage && 
        article.description && 
        article.title && 
        !article.title.includes('[Removed]') &&
        article.urlToImage.startsWith('https') &&
        // Filter out non-tech news
        (article.title.toLowerCase().includes('tech') ||
         article.title.toLowerCase().includes('ai') ||
         article.title.toLowerCase().includes('job') ||
         article.title.toLowerCase().includes('developer') ||
         article.description.toLowerCase().includes('technology'))
      ))
      .map((article: any) => ({
        title: article.title,
        description: article.description,
        source: { name: article.source.name },
        publishedAt: article.publishedAt,
        url: article.url,
        // Add random query parameter to force image refresh
        urlToImage: `${article.urlToImage}?t=${Date.now()}&r=${Math.random()}`
      }));

    // Randomly select 4 articles, ensuring mix of different categories
    const selectedArticles = [...allArticles]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    if (selectedArticles.length === 0) {
      return NextResponse.json(getFallbackNews());
    }

    return NextResponse.json(selectedArticles);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(getFallbackNews());
  }
}

// Updated fallback news with more relevant content
function getFallbackNews() {
  return [
    {
      title: "Tech Industry Sees Surge in AI and ML Job Opportunities",
      description: "Major tech companies are ramping up hiring for artificial intelligence and machine learning positions, offering competitive packages...",
      source: { name: "Tech Careers" },
      publishedAt: new Date().toISOString(),
      url: "https://example.com/tech-jobs",
      urlToImage: "https://picsum.photos/800/400?random=1"
    },
    {
      title: "Revolutionary AI Tool Transforms Software Development",
      description: "New AI-powered development tool promises to increase programmer productivity by 300% through intelligent code generation...",
      source: { name: "Tech Innovation" },
      publishedAt: new Date().toISOString(),
      url: "https://example.com/ai-coding",
      urlToImage: "https://picsum.photos/800/400?random=2"
    },
    {
      title: "Remote Work Revolution: Tech Companies Lead the Way",
      description: "Leading technology companies are embracing permanent remote work policies, reshaping the future of employment...",
      source: { name: "Future Work" },
      publishedAt: new Date().toISOString(),
      url: "https://example.com/remote-work",
      urlToImage: "https://picsum.photos/800/400?random=3"
    },
    {
      title: "Next-Gen Programming Languages Transform Industry",
      description: "Emerging programming languages and frameworks are changing how developers build applications, creating new job opportunities...",
      source: { name: "Dev Trends" },
      publishedAt: new Date().toISOString(),
      url: "https://example.com/programming-trends",
      urlToImage: "https://picsum.photos/800/400?random=4"
    }
  ];
} 