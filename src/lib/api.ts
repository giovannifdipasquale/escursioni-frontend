import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API || 'http://localhost:1337/api',
});

export default api;