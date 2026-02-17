import cron from 'node-cron';
import { fetchExternalJobs } from './jobProviders/index.js';
import JobPosting from '../models/jobPosting.model.js';

const scheduleJobs = () => {
    console.log('Initializing Job Scheduler...');

    // Run every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('Running scheduled job fetch...');
        try {
            const externalJobs = await fetchExternalJobs();

            console.log(`Fetched ${externalJobs.length} jobs from external sources.`);

            for (const job of externalJobs) {
                // Check if job already exists by externalId
                const exists = await JobPosting.findOne({ externalId: String(job.externalId) });
                if (!exists) {
                    await JobPosting.create(job);
                    console.log(`Saved new job: ${job.jobTitle}`);
                } else {
                    // updates if necessary
                }
            }
            console.log('Job fetch completed.');

        } catch (error) {
            console.error('Error in scheduled job fetch:', error);
        }
    });
};

export default scheduleJobs;
