import apiClient from './client'

export function getProfile() {
  return apiClient.get('/api/profile')
}

export function updateProfile(profileData) {
  return apiClient.put('/api/profile', profileData)
}
