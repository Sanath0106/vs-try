import { NextResponse } from 'next/server';

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export async function GET() {
  try {
    // Different job queries to get variety
    const queries = [
      'software engineer',
      'frontend developer',
      'full stack developer',
      'machine learning engineer'
    ];

    // Randomly select 2 queries
    const selectedQueries = queries.sort(() => Math.random() - 0.5).slice(0, 2);
    
    const promises = selectedQueries.map(query => {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY || '',
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      };

      return fetch(
        `https://jsearch.p.rapidapi.com/search?` +
        `query=${encodeURIComponent(query)}` +
        `&page=1` +
        `&num_pages=1` +
        `&date_posted=today` +
        `&remote_jobs_only=false` +
        `&employment_types=FULLTIME` +
        `&_=${Date.now()}`,
        options
      ).then(res => res.json());
    });

    const results = await Promise.all(promises);
    
    // Combine and process jobs
    const allJobs = results.flatMap(result => result.data || [])
      .filter(job => job.employer_name && job.job_title)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(job => ({
        job_id: job.job_id || String(Math.random()),
        job_title: job.job_title,
        company_name: job.employer_name,
        location: job.job_city 
          ? `${job.job_city}, ${job.job_country}`
          : job.job_country || 'Remote',
        job_type: job.job_employment_type || 'Full-time',
        posted_date: job.job_posted_at_datetime_utc,
        linkedin_job_url_cleaned: job.job_apply_link,
        company_url: job.employer_website,
        company_logo: job.employer_logo
      }));

    return NextResponse.json(allJobs);
  } catch (error) {
    console.error('Error in jobs API:', error);
    return NextResponse.json([]);
  }
} 