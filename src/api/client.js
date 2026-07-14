import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://github-backend-covl.onrender.com';

const client = axios.create({
  baseURL,
  timeout: 20000,
});

/** Extracts a readable message from an axios error, falling back gracefully. */
function extractMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === 'ECONNABORTED') return 'The request timed out. The backend may be slow to respond.';
  if (err.message === 'Network Error') return `Can't reach the API at ${baseURL}. Is the backend running?`;
  return err.message || 'Something went wrong.';
}

/** POST /api/profile/analyze/:username */
export async function analyzeProfile(username) {
  try {
    const { data } = await client.post(`/api/profile/analyze/${encodeURIComponent(username)}`);
    return data.data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

/** GET /api/profile */
export async function getAllProfiles({ sortBy = 'analyzed_at', order = 'desc', limit = 50, page = 1 } = {}) {
  try {
    const { data } = await client.get('/api/profile', { params: { sortBy, order, limit, page } });
    return data; // { success, count, total, page, totalPages, data }
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

/** GET /api/profile/:username */
export async function getProfile(username) {
  try {
    const { data } = await client.get(`/api/profile/${encodeURIComponent(username)}`);
    return data.data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

/** DELETE /api/profile/:username */
export async function deleteProfile(username) {
  try {
    const { data } = await client.delete(`/api/profile/${encodeURIComponent(username)}`);
    return data;
  } catch (err) {
    throw new Error(extractMessage(err));
  }
}

export { baseURL };
