import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 20000,
});

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiClient.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
      // Request was sent but no response received (e.g., backend down / connection refused).
      throw new Error(
        'Cannot reach the analysis backend at http://127.0.0.1:5000. ' +
          'Make sure the Flask server is running.'
      );
    }

    throw new Error(error.message || 'Unexpected error while calling backend.');
  }
}

