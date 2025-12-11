import { useState, useEffect } from 'react'
import { getAppliedJobs } from '../../services/api'
import Table from '../../components/Table'
import Loading from '../../components/Loading'

export default function AppliedJobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppliedJobs()
  }, [])

  const loadAppliedJobs = async () => {
    try {
      setLoading(true)
      const candidateId = localStorage.getItem('candidate_id') || 'demo-candidate'
      const data = await getAppliedJobs(candidateId)
      setJobs(data)
    } catch (error) {
      console.error('Failed to load applied jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'shortlisted':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'interview':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'offer':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Applied Jobs</h1>
        <p className="text-gray-400">Track your job applications and their status</p>
      </div>

      {loading ? (
        <Loading message="Loading your applications..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-gray-400 text-sm mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-white">{jobs.length}</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-1">Shortlisted</p>
              <p className="text-3xl font-bold text-green-400">
                {jobs.filter(j => j.status === 'Shortlisted').length}
              </p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-1">Interviews</p>
              <p className="text-3xl font-bold text-yellow-400">
                {jobs.filter(j => j.status === 'Interview').length}
              </p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-1">Offers</p>
              <p className="text-3xl font-bold text-purple-400">
                {jobs.filter(j => j.status === 'Offer').length}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Application History</h2>
            
            <Table
              columns={['Job Title', 'Company', 'Applied Date', 'Status', 'Match %', 'Actions']}
              data={jobs}
              renderRow={(job) => (
                <>
                  <td className="font-medium text-gray-900 dark:text-white">{job.jobTitle}</td>
                  <td>{job.company}</td>
                  <td>{new Date(job.appliedDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            job.matchPercentage >= 80 ? 'bg-green-500' :
                            job.matchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${job.matchPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{job.matchPercentage}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View Details →
                    </button>
                  </td>
                </>
              )}
            />
          </div>
        </>
      )}
    </div>
  )
}
