import axios from 'axios';

const BASE_URL = 'https://jooble.org/api/';

const cleanHTML = (str) => {
    if (!str) return 'No description provided.';
    return str
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&[a-z]+;/g, '')
        .trim();
};

export const fetchJoobleJobs = async (page = 1) => {
    try {
        const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

        if (!JOOBLE_API_KEY) {
            console.error('Jooble API credentials missing.');
            return [];
        }

        const response = await axios.post(`${BASE_URL}${JOOBLE_API_KEY}`, {
            keywords: 'IT, Engineering, Developer',
            location: 'India',
            page: String(page),
            companysearch: "false"
        }, {
            headers: {
                'Content-type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        if (response.data && response.data.jobs) {
            const mappedJobs = response.data.jobs.map(job => ({
                jobTitle: job.title,
                jobDescription: cleanHTML(job.snippet),
                Company: job.company || 'Unknown Company',
                requiredSkills: [],
                Type: 'off-campus',
                batch: new Date().getFullYear(),
                Deadline: null,
                ApplicationLink: job.link,
                Expiry: null,
                source: 'Jooble',
                externalId: String(job.id),
                originalLink: job.link,
                isScraped: true,
                location: job.location,
                salary: job.salary || "Not Disclosed"
            }));
            
            return mappedJobs;
        }

        return [];
    } catch (error) {
        console.error('Error fetching jobs from Jooble:', error.message);
        return [];
    }
};
