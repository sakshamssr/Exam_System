import apiClient from './client'

export function getStudents() {
  return apiClient.get('/api/admin/students')
}

export function createStudent(studentData) {
  return apiClient.post('/api/admin/students', studentData)
}
