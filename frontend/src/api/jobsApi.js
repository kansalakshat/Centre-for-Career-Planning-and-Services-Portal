import axios from 'axios';

const BACKEND_ROOT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// This logic ensures BASE_URL is the root API path, e.g., 'http://localhost:3000/api'
const BASE_URL = BACKEND_ROOT.endsWith('/api')
    ? BACKEND_ROOT
    : BACKEND_ROOT.replace(/\/$/, '') + '/api';

// 🟢 CRITICAL FIX: Define the specific resource endpoint.
// Assuming your Express app uses: app.use('/api/jobs', jobRoutes)
const JOBS_ENDPOINT = `${BASE_URL}/jobs`; 


export { JOBS_ENDPOINT }; 

export const updateJobPosting = async (jobId, jobData, token) => {
    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
    });

    // Check for 204 No Content response
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { _id: jobId }; 
    }
    
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update job (Status: ${response.status})`);
        } catch (e) {
            throw new Error(`Failed to update job. Server returned status ${response.status} with unexpected response format.`);
        }
    }

    const data = await response.json();
    
    return data.job; 
};

/**
 * Fetches the list of all job postings.
 * @param {string} token - The authorization token.
 * @returns {Promise<object>} The response data from the server.
 */
export const fetchJobs = async (token, page = 1, limit = 15, search = "") => {
    // Admin uses the legacy endpoint with applicationCount sorting
    let url = `${JOBS_ENDPOINT}/admin?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Crucial: Pass the authentication token
            'Authorization': `Bearer ${token}`, 
        },
    });

    if (!response.ok) {
        // Attempt to parse the server's error message for better debugging
        const errorData = await response.json().catch(() => ({ message: 'Server did not return JSON.' }));
        // Throws a more informative error. Your `JobManagementPage.jsx` catches this.
        throw new Error(errorData.message || `Failed to fetch jobs (Status: ${response.status})`);
    }

export const updateJobPosting = async (jobId, jobData, token) => {
  const { data } = await axios.put(`${BASE_URL}/jobs/${jobId}`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.job;
};

export const deleteJob = async (jobId, token) => {
  const { data } = await axios.delete(`${BASE_URL}/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createJobPosting = async (jobData, token) => {
  const { data } = await axios.post(`${BASE_URL}/jobs`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const upvoteJob = async (jobId, token) => {
  const { data } = await axios.post(`${BASE_URL}/jobs/upvote/${jobId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const downvoteJob = async (jobId, token) => {
  const { data } = await axios.post(`${BASE_URL}/jobs/downvote/${jobId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
