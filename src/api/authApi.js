import apiClient from './client'

export function login(loginData) {
  return apiClient.post('/api/auth/login', loginData)
}

export function signup(signupData) {
  return apiClient.post('/api/auth/signup', signupData)
}
