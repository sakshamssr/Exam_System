import apiClient from './client'

export function getMyResults() {
  return apiClient.get('/api/results')
}

export function getAllResults() {
  return apiClient.get('/api/results/admin')
}
