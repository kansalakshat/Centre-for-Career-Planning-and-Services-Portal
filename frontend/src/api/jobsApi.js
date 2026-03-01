import axios from 'axios';

const BACKEND_ROOT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BASE_URL = BACKEND_ROOT.replace(/\/$/, '') + '/api';

export const fetchJobs = async (token) => {
  const { data } = await axios.get(`${BASE_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

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
