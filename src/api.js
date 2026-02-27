import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 20000,
});

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

