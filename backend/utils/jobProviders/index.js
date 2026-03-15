import { fetchAdzunaJobs } from './adzuna.js';
import { fetchJoobleJobs } from './jooble.js';

export const fetchExternalJobs = async () => {
    console.log('Starting external job fetch...');
    const MAX_PAGES = 3;
    let allJobs = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
        console.log(`Fetching page ${page} from providers...`);
        
        // Fetch from Adzuna
        const adzunaJobs = await fetchAdzunaJobs('in', page);
        
        // Fetch from Jooble
        const joobleJobs = await fetchJoobleJobs(page);
        
        allJobs = [...allJobs, ...adzunaJobs, ...joobleJobs];
        
        // 1-second delay to avoid aggressive rate-limiting
        if (page < MAX_PAGES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return allJobs;
};
