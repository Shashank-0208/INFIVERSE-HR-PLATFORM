import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { updateCandidateProfile, getCandidateProfile } from '../../services/api'
import FormInput from '../../components/FormInput'

export default function CandidateProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    totalExperience: '',
    skills: '',
    educationLevel: '',
    expectedSalary: '',
    resume: null as File | null,
  })

  useEffect(() => {
    const candidateId = localStorage.getItem('candidate_id')
    if (candidateId) {
      loadProfile(candidateId)
    }
  }, [])

  const loadProfile = async (candidateId: string) => {
    try {
      const data = await getCandidateProfile(candidateId)
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          totalExperience: data.totalExperience?.toString() || '',
          skills: data.skills?.join(', ') || '',
          educationLevel: data.educationLevel || '',
          expectedSalary: data.expectedSalary?.toString() || '',
          resume: null,
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      setFormData({ ...formData, resume: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const candidateId = localStorage.getItem('candidate_id') || 'demo-candidate'
      
      // In production, handle file upload separately
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        totalExperience: parseFloat(formData.totalExperience),
        expectedSalary: parseInt(formData.expectedSalary),
      }
      
      await updateCandidateProfile(candidateId, profileData)
      toast.success('Profile updated successfully!')
      navigate('/candidate/applied-jobs')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Update your professional information</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@email.com"
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            required
          />

          <FormInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Bangalore, India"
            required
          />

          <FormInput
            label="Total Experience (years)"
            name="totalExperience"
            type="number"
            value={formData.totalExperience}
            onChange={handleChange}
            placeholder="4.5"
            required
          />

          <FormInput
            label="Expected Salary (₹ per annum)"
            name="expectedSalary"
            type="number"
            value={formData.expectedSalary}
            onChange={handleChange}
            placeholder="1500000"
            required
          />

          <FormInput
            label="Education Level"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            required
            options={[
              { value: 'High School', label: 'High School' },
              { value: 'Bachelor', label: 'Bachelor' },
              { value: 'Master', label: 'Master' },
              { value: 'PhD', label: 'PhD' },
            ]}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Resume (PDF only)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 shadow-sm"
            />
            <p className="text-gray-500 text-xs mt-1">Max size: 5MB</p>
          </div>
        </div>

        <div className="mt-6">
          <FormInput
            label="Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, Python (comma separated)"
            required
          />
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/candidate/applied-jobs')}
            className="btn-secondary"
          >
            View Applied Jobs
          </button>
        </div>
      </form>
    </div>
  )
}
