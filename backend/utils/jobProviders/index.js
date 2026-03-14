import { fetchAdzunaJobs } from './adzuna.js';
import { fetchJoobleJobs } from './jooble.js';

export const fetchExternalJobs = async () => {
    console.log('Starting external job fetch...');

    // Fetch from Adzuna
    const adzunaJobs = await fetchAdzunaJobs();

    // Fetch from Jooble
    const joobleJobs = await fetchJoobleJobs();

    return [...adzunaJobs, ...joobleJobs];
};
