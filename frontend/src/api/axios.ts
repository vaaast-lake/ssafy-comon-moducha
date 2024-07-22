import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER_URL}/api/v1`,
  timeout: 1000
});

export default instance;
