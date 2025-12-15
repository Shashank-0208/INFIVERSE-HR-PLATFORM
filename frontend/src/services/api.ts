import axios from 'axios'

// API Base URL - Gateway service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Add API key if available
    const apiKey = localStorage.getItem('api_key')
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('candidate_id')
      window.location.href = '/auth/candidate'
    }
    return Promise.reject(error)
  }
)

// ==================== CANDIDATE AUTH API ====================

export interface CandidateLoginRequest {
  email: string
  password?: string
}

export interface CandidateRegisterRequest {
  name: string
  email: string
  password?: string
  phone?: string
  skills?: string[]
  experience_years?: number
  education?: string
  location?: string
}

export interface CandidateProfile {
  id: string
  name: string
  email: string
  phone?: string
  skills: string[]
  experience_years: number
  totalExperience?: number
  education?: string
  educationLevel?: string
  location?: string
  resume_url?: string
  expectedSalary?: number
  currentSalary?: number
  values_score?: {
    integrity: number
    honesty: number
    discipline: number
    hardWork: number
    gratitude: number
  }
}

export const candidateLogin = async (data: CandidateLoginRequest) => {
  try {
    const response = await api.post('/v1/candidate/login', data)
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.token || '')
      localStorage.setItem('candidate_id', response.data.candidate_id)
      localStorage.setItem('user_name', response.data.name || '')
      localStorage.setItem('user_email', data.email)
    }
    return response.data
  } catch (error) {
    console.error('Candidate login error:', error)
    throw error
  }
}

export const candidateRegister = async (data: CandidateRegisterRequest) => {
  try {
    const response = await api.post('/v1/candidate/register', data)
    return response.data
  } catch (error) {
    console.error('Candidate registration error:', error)
    throw error
  }
}

// ==================== JOBS API ====================

export interface Job {
  id: string
  title: string
  department?: string
  location: string
  job_type: string
  experience_required: string
  salary_min?: number
  salary_max?: number
  skills_required: string[] | string
  description: string
  status: string
  created_at?: string
  company?: string
}

export interface JobFilters {
  skills?: string
  location?: string
  experience?: string
  job_type?: string
  search?: string
}

export const getJobs = async (filters?: JobFilters): Promise<Job[]> => {
  try {
    const params = new URLSearchParams()
    if (filters?.skills) params.append('skills', filters.skills)
    if (filters?.location) params.append('location', filters.location)
    if (filters?.experience) params.append('experience', filters.experience)
    if (filters?.job_type) params.append('job_type', filters.job_type)
    if (filters?.search) params.append('search', filters.search)
    
    const response = await api.get(`/v1/jobs?${params.toString()}`)
    return response.data.jobs || response.data || []
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const response = await api.get(`/v1/jobs/${jobId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching job:', error)
    throw error
  }
}

export const createJob = async (jobData: Partial<Job>) => {
  try {
    const response = await api.post('/v1/jobs', jobData)
    return response.data
  } catch (error) {
    console.error('Error creating job:', error)
    throw error
  }
}

// ==================== CANDIDATE APPLICATIONS API ====================

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  job_title: string
  company?: string
  status: 'applied' | 'screening' | 'shortlisted' | 'interview' | 'offer' | 'rejected' | 'hired'
  match_score?: number
  applied_date: string
  updated_at?: string
}

export const applyForJob = async (jobId: string, candidateId: string, resumeUrl?: string) => {
  try {
    const response = await api.post('/v1/candidate/apply', {
      job_id: jobId,
      candidate_id: candidateId,
      resume_url: resumeUrl
    })
    return response.data
  } catch (error) {
    console.error('Error applying for job:', error)
    throw error
  }
}

export const getCandidateApplications = async (candidateId: string): Promise<Application[]> => {
  try {
    const response = await api.get(`/v1/candidate/applications/${candidateId}`)
    return response.data.applications || response.data || []
  } catch (error) {
    console.error('Error fetching applications:', error)
    throw error
  }
}

// ==================== CANDIDATE PROFILE API ====================

export const getCandidateProfile = async (candidateId: string): Promise<CandidateProfile> => {
  try {
    const response = await api.get(`/v1/candidates/${candidateId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    throw error
  }
}

export const updateCandidateProfile = async (candidateId: string, data: Partial<CandidateProfile>) => {
  try {
    const response = await api.put(`/v1/candidate/profile/${candidateId}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating candidate profile:', error)
    throw error
  }
}

export const getCandidatesByJob = async (jobId: string) => {
  try {
    const response = await api.get(`/v1/match/${jobId}/top`)
    return response.data.matches || response.data || []
  } catch (error) {
    console.error('Error fetching candidates:', error)
    throw error
  }
}

// ==================== INTERVIEWS API ====================

export interface Interview {
  id: string
  candidate_id: string
  job_id: string
  job_title?: string
  company?: string
  scheduled_date: string
  scheduled_time?: string
  interview_type: string
  meeting_link?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
}

export const getInterviews = async (candidateId?: string): Promise<Interview[]> => {
  try {
    const params = candidateId ? `?candidate_id=${candidateId}` : ''
    const response = await api.get(`/v1/interviews${params}`)
    return response.data.interviews || response.data || []
  } catch (error) {
    console.error('Error fetching interviews:', error)
    throw error
  }
}

export const scheduleInterview = async (data: Partial<Interview>) => {
  try {
    const response = await api.post('/v1/interviews', data)
    return response.data
  } catch (error) {
    console.error('Error scheduling interview:', error)
    throw error
  }
}

// ==================== FEEDBACK API ====================

export interface Feedback {
  id: string
  candidate_id: string
  job_id?: string
  job_title?: string
  interviewer_name?: string
  feedback_text: string
  rating?: number
  values_assessment?: {
    integrity: number
    honesty: number
    discipline: number
    hardWork: number
    gratitude: number
  }
  decision?: 'accept' | 'reject' | 'hold'
  created_at: string
}

export const getCandidateFeedback = async (candidateId: string): Promise<Feedback[]> => {
  try {
    const response = await api.get(`/v1/feedback?candidate_id=${candidateId}`)
    return response.data.feedback || response.data || []
  } catch (error) {
    console.error('Error fetching feedback:', error)
    throw error
  }
}

export const submitFeedback = async (candidateId: string, feedbackData: Partial<Feedback>) => {
  try {
    const response = await api.post('/v1/feedback', {
      candidate_id: candidateId,
      ...feedbackData
    })
    return response.data
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

// ==================== TASKS API ====================

export interface Task {
  id: string
  candidate_id: string
  job_id: string
  job_title?: string
  title: string
  description: string
  deadline: string
  status: 'pending' | 'in_progress' | 'submitted' | 'reviewed'
  submission_url?: string
}

export const getTasks = async (candidateId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/v1/tasks?candidate_id=${candidateId}`)
    return response.data.tasks || response.data || []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    // Return empty array if tasks endpoint doesn't exist
    return []
  }
}

export const submitTask = async (taskId: string, submissionUrl: string) => {
  try {
    const response = await api.put(`/v1/tasks/${taskId}/submit`, { submission_url: submissionUrl })
    return response.data
  } catch (error) {
    console.error('Error submitting task:', error)
    throw error
  }
}

// ==================== OFFERS API ====================

export interface Offer {
  id: string
  candidate_id: string
  job_id: string
  job_title?: string
  company?: string
  salary_offered: number
  joining_date?: string
  status: 'pending' | 'accepted' | 'rejected' | 'negotiating'
  created_at: string
}

export const getCandidateOffers = async (candidateId: string): Promise<Offer[]> => {
  try {
    const response = await api.get(`/v1/offers?candidate_id=${candidateId}`)
    return response.data.offers || response.data || []
  } catch (error) {
    console.error('Error fetching offers:', error)
    return []
  }
}

export const respondToOffer = async (offerId: string, response: 'accepted' | 'rejected') => {
  try {
    const res = await api.put(`/v1/offers/${offerId}`, { status: response })
    return res.data
  } catch (error) {
    console.error('Error responding to offer:', error)
    throw error
  }
}

// ==================== AUTOMATION API ====================

export const triggerAutomation = async (type: string, data?: Record<string, unknown>) => {
  try {
    const response = await api.post('/v1/automation/trigger', { type, ...data })
    return response.data
  } catch (error) {
    console.error('Error triggering automation:', error)
    throw error
  }
}

// ==================== CANDIDATE ACTIONS API ====================

export const shortlistCandidate = async (jobId: string, candidateId: string) => {
  try {
    const response = await api.post(`/v1/jobs/${jobId}/shortlist`, { candidate_id: candidateId })
    return response.data
  } catch (error) {
    console.error('Error shortlisting candidate:', error)
    throw error
  }
}

export const rejectCandidate = async (jobId: string, candidateId: string) => {
  try {
    const response = await api.post(`/v1/jobs/${jobId}/reject`, { candidate_id: candidateId })
    return response.data
  } catch (error) {
    console.error('Error rejecting candidate:', error)
    throw error
  }
}

export const assignTask = async (jobId: string, candidateId: string, taskData: Partial<Task>) => {
  try {
    const response = await api.post('/v1/tasks', {
      job_id: jobId,
      candidate_id: candidateId,
      ...taskData
    })
    return response.data
  } catch (error) {
    console.error('Error assigning task:', error)
    throw error
  }
}

// ==================== DASHBOARD STATS API ====================

export interface DashboardStats {
  total_applications: number
  interviews_scheduled: number
  profile_views: number
  shortlisted: number
  offers_received: number
}

export const getCandidateDashboardStats = async (candidateId: string): Promise<DashboardStats> => {
  try {
    // Try to get stats from dedicated endpoint, fallback to computing from other endpoints
    const response = await api.get(`/v1/candidate/stats/${candidateId}`)
    return response.data
  } catch {
    // Compute stats from other endpoints if dedicated endpoint doesn't exist
    try {
      const [applications, interviews, offers] = await Promise.all([
        getCandidateApplications(candidateId),
        getInterviews(candidateId),
        getCandidateOffers(candidateId)
      ])
      
      return {
        total_applications: applications.length,
        interviews_scheduled: interviews.filter(i => i.status === 'scheduled').length,
        profile_views: 0,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        offers_received: offers.length
      }
    } catch {
      return {
        total_applications: 0,
        interviews_scheduled: 0,
        profile_views: 0,
        shortlisted: 0,
        offers_received: 0
      }
    }
  }
}

export default api
