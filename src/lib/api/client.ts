import axios from 'axios';

export const clientApi = axios.create({
  baseURL: '/api/backend',
  withCredentials: true,
});

export default clientApi;
