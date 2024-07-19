import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER_URL}/api/1v`,
});

export default instance;
