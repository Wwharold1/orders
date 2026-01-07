import axios from 'axios';

export const apiUrl = axios.create({
  baseURL: `${process.env.NEXT_API_BASE_URL}/api`,
  headers: {
    Accept: 'application/json',
    'x-platform-request': 'WEB',
  },
});

export const noTokenApiUrl = axios.create({
  baseURL: `${process.env.NEXT_API_BASE_URL}/api`,
  headers: {
    Accept: 'application/json',
    'x-platform-request': 'WEB',
  },
});

export const TOCApiUrl = axios.create({
  baseURL: `${process.env.NEXT_API_BASE_URL}/api/toc`,
  headers: {
    Accept: 'application/json',
    'x-platform-request': 'WEB',
  },
});

export const spectrumApiUrl = axios.create({
  baseURL: `${process.env.NEXT_API_BASE_URL}/api/spectrum`,
  headers: {
    Accept: 'application/json',
    'x-platform-request': 'WEB',
  },
});
