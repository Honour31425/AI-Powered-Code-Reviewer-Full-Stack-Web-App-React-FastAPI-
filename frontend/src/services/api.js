import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
})

export const reviewCode = async (code, language) => {
  const response = await api.post('/review', { code, language })
  return response.data
}

export const reviewFile = async (file, language) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('language', language)
  const response = await api.post('/review/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const getSupportedLanguages = async () => {
  const response = await api.get('/languages')
  return response.data
}
