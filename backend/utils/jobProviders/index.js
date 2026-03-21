import { fetchAdzunaJobs } from './adzuna.js';
import { fetchJoobleJobs } from './jooble.js';

export const fetchExternalJobs = async () => {
    console.log('Starting external job fetch...');
    const MAX_PAGES = 3;
    let allJobs = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
        console.log(`Fetching page ${page} from providers...`);
        
        // Fetch from both providers in parallel with error isolation
        const [adzunaResult, joobleResult] = await Promise.allSettled([
            fetchAdzunaJobs('in', page),
            fetchJoobleJobs(page)
        ]);

        if (adzunaResult.status === 'fulfilled') {
            allJobs = [...allJobs, ...adzunaResult.value];
        } else {
            console.error(`Adzuna failed on page ${page}:`, adzunaResult.reason?.message);
        }

        if (joobleResult.status === 'fulfilled') {
            allJobs = [...allJobs, ...joobleResult.value];
        } else {
            console.error(`Jooble failed on page ${page}:`, joobleResult.reason?.message);
        }
        
        // 1-second delay to avoid aggressive rate-limiting
        if (page < MAX_PAGES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return allJobs;
};
