import axios from 'axios';

const BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

export const fetchAdzunaJobs = async (country = 'in', page = 1) => {
    try {
        const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
        const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

        if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
            console.error('Adzuna API credentials missing.');
            return [];
        }

        const categories = ['it-jobs', 'engineering-jobs'];
        let allJobs = [];

        for (const category of categories) {
            const response = await axios.get(`${BASE_URL}/${country}/search/${page}`, {
                params: {
                    app_id: ADZUNA_APP_ID,
                    app_key: ADZUNA_APP_KEY,
                    results_per_page: 50,
                    category: category,
                    salary_min: 1200000, // 12 LPA
                    'content-type': 'application/json',
                }
            });

            if (response.data && response.data.results) {
                const cleanHTML = (str) => {
                    if (!str) return 'No description provided.';
                    return str
                        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
                        .replace(/&nbsp;/g, ' ')   // Replace non-breaking spaces
                        .replace(/&amp;/g, '&')    // Replace ampersands
                        .replace(/&[a-z]+;/g, '')  // Remove other HTML entities
                        .replace(/\s+/g, ' ')      // Collapse multiple spaces
                        .trim();
                };

                const mappedJobs = response.data.results.map(job => ({
                    jobTitle: job.title,
                    jobDescription: cleanHTML(job.description),
                    Company: job.company.display_name,
                    requiredSkills: [],
                    Type: 'off-campus',
                    batch: new Date().getFullYear(),
                    Deadline: null,
                    ApplicationLink: job.redirect_url,
                    Expiry: null,
                    source: 'Adzuna',
                    externalId: String(job.id),
                    originalLink: job.redirect_url,
                    isScraped: true,
                    location: job.location.display_name,
                    salary: job.salary_min && job.salary_max 
                        ? (job.salary_min === job.salary_max 
                            ? `${(job.salary_min / 100000).toFixed(1)} LPA` 
                            : `${(job.salary_min / 100000).toFixed(1)}-${(job.salary_max / 100000).toFixed(1)} LPA`)
                        : (job.salary_min ? `${(job.salary_min / 100000).toFixed(1)} LPA` : "Not Disclosed")
                }));
                allJobs = [...allJobs, ...mappedJobs];
            }
        }

        return allJobs;
    } catch (error) {
        console.error('Error fetching jobs from Adzuna:', error.message);
        return [];
    }
};
