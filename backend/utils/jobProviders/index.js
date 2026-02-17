import { fetchAdzunaJobs } from './adzuna.js';

export const fetchExternalJobs = async () => {
    console.log('Starting external job fetch...');

    // Fetch from Adzuna
    const adzunaJobs = await fetchAdzunaJobs();

    // Future: Fetch from Jooble, etc.

    return [...adzunaJobs];
};
