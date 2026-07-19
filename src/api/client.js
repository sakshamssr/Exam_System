import axios from 'axios'
import { getAuthToken } from '../lib/auth'

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export { API_BASE_URL }
export default apiClient
