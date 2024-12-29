// API service for news and jobs
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export interface NewsItem {
  title: string;
  description: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
  urlToImage?: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  type: string;
  created_at: string;
  url: string;
  how_to_apply: string;
  company_url?: string;
}

export async function fetchTechNews(): Promise<NewsItem[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`/api/news?t=${timestamp}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return getFallbackNews();
  }
}

// Add fallback news data
function getFallbackNews(): NewsItem[] {
  return [
    {
      title: "Google Announces Major AI Breakthrough",
      description: "Google's DeepMind has achieved a significant milestone in artificial intelligence research...",
      source: { name: "Tech News" },
      publishedAt: new Date().toISOString(),
      url: "https://news.google.com",
      urlToImage: "https://picsum.photos/800/400?random=1"
    },
    {
      title: "Microsoft's New AI-Powered Developer Tools",
      description: "Microsoft unveils new AI-powered features for Visual Studio Code and GitHub Copilot...",
      source: { name: "Developer Weekly" },
      publishedAt: new Date().toISOString(),
      url: "https://news.microsoft.com",
      urlToImage: "https://picsum.photos/800/400?random=2"
    },
    {
      title: "Tech Industry Hiring Trends 2024",
      description: "Analysis of current hiring trends in the technology sector shows increased demand for AI and ML engineers...",
      source: { name: "Industry Insights" },
      publishedAt: new Date().toISOString(),
      url: "https://techjobs.news",
      urlToImage: "https://picsum.photos/800/400?random=3"
    }
  ];
}

export async function fetchTechJobs(): Promise<JobItem[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`/api/jobs?t=${timestamp}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    return data.map((job: any) => ({
      id: job.job_id || String(Math.random()),
      title: job.job_title,
      company: job.company_name,
      location: job.location || 'Remote',
      type: job.job_type || "Full-time",
      created_at: job.posted_date || new Date().toISOString(),
      url: job.linkedin_job_url_cleaned || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.job_title)}`,
      how_to_apply: "Apply via LinkedIn",
      company_url: job.company_url,
      company_logo: `https://logo.clearbit.com/${job.company_name?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com?t=${timestamp}`
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return getFallbackJobs();
  }
}

// Fallback jobs data
function getFallbackJobs(): JobItem[] {
  return [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Google",
      location: "Remote / Mountain View, CA",
      type: "Full-time",
      created_at: new Date().toISOString(),
      url: "https://careers.google.com",
      how_to_apply: "Apply via website",
      company_url: "https://google.com",
      company_logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "Microsoft",
      location: "Remote / Redmond, WA",
      type: "Full-time",
      created_at: new Date().toISOString(),
      url: "https://careers.microsoft.com",
      how_to_apply: "Apply via website",
      company_url: "https://microsoft.com",
      company_logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
    },
    {
      id: "3",
      title: "Software Development Engineer",
      company: "Amazon",
      location: "Remote / Seattle, WA",
      type: "Full-time",
      created_at: new Date().toISOString(),
      url: "https://amazon.jobs",
      how_to_apply: "Apply via website",
      company_url: "https://amazon.com",
      company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
    },
    {
      id: "4",
      title: "ML Engineer",
      company: "Meta",
      location: "Remote / Menlo Park, CA",
      type: "Full-time",
      created_at: new Date().toISOString(),
      url: "https://metacareers.com",
      how_to_apply: "Apply via website",
      company_url: "https://meta.com",
      company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png"
    }
  ];
} 