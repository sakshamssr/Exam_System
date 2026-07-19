import apiClient from './client'

export function getExams() {
  return apiClient.get('/api/exams')
}

export function getExam(id) {
  return apiClient.get(`/api/exams/${id}`)
}

export function createExam(examData) {
  return apiClient.post('/api/exams/admin/create', examData)
}

export function updateExam(id, examData) {
  return apiClient.put(`/api/exams/admin/${id}`, examData)
}

export function deleteExam(id) {
  return apiClient.delete(`/api/exams/admin/${id}`)
}

export function submitExam(id, answers) {
  return apiClient.post(`/api/exams/${id}/submit`, { answers })
}
