import axios from 'axios';

// In dev, Vite proxies /analyze and /outputs to the backend
const baseURL = import.meta.env.DEV ? '' : 'http://127.0.0.1:5000';
const apiKey = import.meta.env.VITE_API_KEY;
const apiClient = axios.create({
  baseURL,
  timeout: 60000,
});

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await apiClient.post('/analyze', formData, {
      headers,
    });

    return response.data;
  } catch (error) {
    // Normalize Axios/network errors into a consistent shape for the UI.
    if (error.response) {
      const payload = error.response.data || {};
      const message =
        payload.message ||
        payload.error ||
        `Backend returned HTTP ${error.response.status}`;
      throw new Error(message);
    }

    if (error.request) {
      throw new Error(
        'Cannot reach the analysis backend. Make sure the Flask server is running (python app.py in backend/).'
      );
    }

    throw new Error(error.message || 'Unexpected error while calling backend.');
  }
}

