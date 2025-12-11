import axios from 'axios'

// API Base URL - Update this when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
      window.location.href = '/candidate'
    }
    return Promise.reject(error)
  }
)

// ==================== MOCK DATA ====================
// TODO: Replace with actual API calls when backend is ready

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'IT',
    location: 'Bangalore',
    jobType: 'Remote',
    experienceRange: '3-5',
    salaryMin: 1200000,
    salaryMax: 2000000,
    educationLevel: 'Bachelor',
    skills: 'React, TypeScript, Tailwind CSS',
    description: 'We are looking for an experienced Frontend Developer...',
    status: 'active',
    applicants: 45,
    shortlisted: 12,
    interviewed: 5,
    offers: 2,
    joined: 1,
  },
  {
    id: '2',
    title: 'Backend Engineer',
    department: 'IT',
    location: 'Mumbai',
    jobType: 'On-site',
    experienceRange: '5+',
    salaryMin: 1500000,
    salaryMax: 2500000,
    educationLevel: 'Bachelor',
    skills: 'Python, FastAPI, PostgreSQL',
    description: 'Join our backend team to build scalable systems...',
    status: 'active',
    applicants: 32,
    shortlisted: 8,
    interviewed: 3,
    offers: 1,
    joined: 0,
  },
]

const MOCK_CANDIDATES = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    location: 'Bangalore',
    totalExperience: 4.5,
    currentSalary: 1000000,
    expectedSalary: 1500000,
    skills: ['React', 'TypeScript', 'Node.js'],
    educationLevel: 'Bachelor',
    resumeUrl: '/resumes/rahul-sharma.pdf',
    matchScore: 92,
    values: {
      integrity: 4.5,
      honesty: 4.8,
      discipline: 4.2,
      hardWork: 4.6,
      gratitude: 4.4,
    },
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 9876543211',
    location: 'Mumbai',
    totalExperience: 5.2,
    currentSalary: 1200000,
    expectedSalary: 1800000,
    skills: ['React', 'JavaScript', 'CSS', 'Figma'],
    educationLevel: 'Bachelor',
    resumeUrl: '/resumes/priya-patel.pdf',
    matchScore: 88,
    values: {
      integrity: 4.7,
      honesty: 4.5,
      discipline: 4.8,
      hardWork: 4.9,
      gratitude: 4.3,
    },
  },
]

const MOCK_APPLIED_JOBS = [
  {
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Corp',
    status: 'Shortlisted',
    matchPercentage: 92,
    appliedDate: '2024-01-15',
  },
  {
    jobId: '2',
    jobTitle: 'Backend Engineer',
    company: 'Innovation Labs',
    status: 'Applied',
    matchPercentage: 85,
    appliedDate: '2024-01-18',
  },
]

const MOCK_INTERVIEWS = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Corp',
    date: '2024-01-25',
    time: '10:00 AM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
  },
]

const MOCK_TASKS = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    taskTitle: 'Build a Todo App',
    description: 'Create a simple todo application using React and TypeScript with CRUD operations.',
    deadline: '2024-01-23',
    status: 'pending',
  },
]

// ==================== API METHODS ====================

// Jobs API
export const getJobs = async () => {
  try {
    // const response = await api.get('/jobs')
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_JOBS), 500)
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

export const getJobById = async (jobId: string) => {
  try {
    // const response = await api.get(`/jobs/${jobId}`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_JOBS.find(j => j.id === jobId)), 500)
    })
  } catch (error) {
    console.error('Error fetching job:', error)
    throw error
  }
}

export const createJob = async (jobData: any) => {
  try {
    // const response = await api.post('/jobs', jobData)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...jobData, id: Date.now().toString(), status: 'active' }), 500)
    })
  } catch (error) {
    console.error('Error creating job:', error)
    throw error
  }
}

// Candidates API
export const getCandidatesByJob = async (jobId: string) => {
  try {
    // const response = await api.get(`/jobs/${jobId}/candidates`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CANDIDATES), 500)
    })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    throw error
  }
}

export const getCandidateProfile = async (candidateId: string) => {
  try {
    // const response = await api.get(`/candidates/${candidateId}`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CANDIDATES.find(c => c.id === candidateId)), 500)
    })
  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    throw error
  }
}

export const updateCandidateProfile = async (candidateId: string, data: any) => {
  try {
    // const response = await api.put(`/candidates/${candidateId}`, data)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...data, id: candidateId }), 500)
    })
  } catch (error) {
    console.error('Error updating candidate profile:', error)
    throw error
  }
}

// Feedback API
export const submitFeedback = async (candidateId: string, feedbackData: any) => {
  try {
    // const response = await api.post(`/candidates/${candidateId}/feedback`, feedbackData)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, ...feedbackData }), 500)
    })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

export const getCandidateFeedback = async (candidateId: string) => {
  try {
    // const response = await api.get(`/candidates/${candidateId}/feedback`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          id: '1',
          jobTitle: 'Senior Frontend Developer',
          comment: 'Great technical skills and excellent communication.',
          values: {
            integrity: 4.5,
            honesty: 4.8,
            discipline: 4.2,
            hardWork: 4.6,
            gratitude: 4.4,
          },
          decision: 'Accept',
          date: '2024-01-20',
        },
      ]), 500)
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    throw error
  }
}

// Applied Jobs API
export const getAppliedJobs = async (candidateId: string) => {
  try {
    // const response = await api.get(`/candidates/${candidateId}/applied-jobs`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_APPLIED_JOBS), 500)
    })
  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    throw error
  }
}

// Interviews API
export const getInterviews = async (candidateId: string) => {
  try {
    // const response = await api.get(`/candidates/${candidateId}/interviews`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_INTERVIEWS), 500)
    })
  } catch (error) {
    console.error('Error fetching interviews:', error)
    throw error
  }
}

// Tasks API
export const getTasks = async (candidateId: string) => {
  try {
    // const response = await api.get(`/candidates/${candidateId}/tasks`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TASKS), 500)
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export const markTaskSubmitted = async (taskId: string) => {
  try {
    // const response = await api.put(`/tasks/${taskId}/submit`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, status: 'submitted' }), 500)
    })
  } catch (error) {
    console.error('Error marking task as submitted:', error)
    throw error
  }
}

// Automation API
export const triggerAutomation = async (type: string, data?: any) => {
  try {
    // const response = await api.post('/automation/trigger', { type, ...data })
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, type, message: `${type} notification triggered successfully` }), 500)
    })
  } catch (error) {
    console.error('Error triggering automation:', error)
    throw error
  }
}

// Candidate Actions API
export const shortlistCandidate = async (jobId: string, candidateId: string) => {
  try {
    // const response = await api.post(`/jobs/${jobId}/candidates/${candidateId}/shortlist`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, status: 'shortlisted' }), 500)
    })
  } catch (error) {
    console.error('Error shortlisting candidate:', error)
    throw error
  }
}

export const rejectCandidate = async (jobId: string, candidateId: string) => {
  try {
    // const response = await api.post(`/jobs/${jobId}/candidates/${candidateId}/reject`)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, status: 'rejected' }), 500)
    })
  } catch (error) {
    console.error('Error rejecting candidate:', error)
    throw error
  }
}

export const assignTask = async (jobId: string, candidateId: string, taskData: any) => {
  try {
    // const response = await api.post(`/jobs/${jobId}/candidates/${candidateId}/assign-task`, taskData)
    // return response.data
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, ...taskData }), 500)
    })
  } catch (error) {
    console.error('Error assigning task:', error)
    throw error
  }
}

export default api
