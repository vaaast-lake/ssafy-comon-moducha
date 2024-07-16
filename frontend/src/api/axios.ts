import axios from 'axios';

const API_URL = `https://httpbin.org/get`;

const instance = axios.create({
  baseURL: API_URL,
});

export default instance;
