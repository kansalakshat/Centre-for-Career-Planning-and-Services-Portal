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

            // Bulk upsert for better performance
            const bulkOps = externalJobs.map(job => ({
                updateOne: {
                    filter: { externalId: String(job.externalId) },
                    update: { $setOnInsert: job },
                    upsert: true
                }
            }));

            if (bulkOps.length > 0) {
                const result = await JobPosting.bulkWrite(bulkOps, { ordered: false });
                console.log(`Inserted ${result.upsertedCount} new jobs, matched ${result.matchedCount} existing.`);
            }
            console.log('Job insertion completed.');

            // Cleanup expired / old external jobs (older than 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const cleanupResult = await JobPosting.deleteMany({
                isScraped: true,
                createdAt: { $lt: thirtyDaysAgo }
            });
            console.log(`Cleaned up ${cleanupResult.deletedCount} old scraped jobs.`);

            console.log('Scheduled job fetch cycle completed successfully.');

        } catch (error) {
            console.error('Error in scheduled job fetch:', error);
        }
    });
};

export default scheduleJobs;
