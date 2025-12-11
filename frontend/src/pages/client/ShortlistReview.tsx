import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getJobById, getCandidatesByJob, shortlistCandidate, rejectCandidate } from '../../services/api'
import Table from '../../components/Table'
import Loading from '../../components/Loading'

export default function ShortlistReview() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<any>(null)
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')

  useEffect(() => {
    loadData()
  }, [jobId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [jobData, candidatesData] = await Promise.all([
        getJobById(jobId!),
        getCandidatesByJob(jobId!)
      ])
      setJob(jobData)
      setCandidates(candidatesData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (candidateId: string) => {
    try {
      await shortlistCandidate(jobId!, candidateId)
      toast.success('Candidate approved for interview')
      loadData()
    } catch (error) {
      toast.error('Failed to approve candidate')
    }
  }

  const handleReject = async (candidateId: string) => {
    try {
      await rejectCandidate(jobId!, candidateId)
      toast.success('Candidate rejected')
      loadData()
    } catch (error) {
      toast.error('Failed to reject candidate')
    }
  }

  const handleRequestMore = () => {
    toast.success('Request sent to recruitment team for more profiles')
  }

  const filteredCandidates = candidates.filter(c => {
    if (filter === 'high') return c.matchScore >= 80
    if (filter === 'medium') return c.matchScore >= 60 && c.matchScore < 80
    return true
  })

  const formatSalary = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  if (loading) {
    return <Loading message="Loading shortlist..." />
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/client')}
          className="text-blue-400 hover:text-blue-300 mb-4 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shortlist Review</h1>
        <p className="text-gray-400">{job?.title} - {job?.location}</p>
      </div>

      {/* Job Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Total Candidates</p>
          <p className="text-3xl font-bold text-white">{candidates.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">High Match (80%+)</p>
          <p className="text-3xl font-bold text-green-400">
            {candidates.filter(c => c.matchScore >= 80).length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Medium Match (60-80%)</p>
          <p className="text-3xl font-bold text-yellow-400">
            {candidates.filter(c => c.matchScore >= 60 && c.matchScore < 80).length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Avg. Match Score</p>
          <p className="text-3xl font-bold text-blue-400">
            {candidates.length > 0 
              ? Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'high' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            High Match ({candidates.filter(c => c.matchScore >= 80).length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Medium Match ({candidates.filter(c => c.matchScore >= 60 && c.matchScore < 80).length})
          </button>
        </div>

        <button onClick={handleRequestMore} className="btn-primary">
          Request More Profiles
        </button>
      </div>

      {/* Candidates Table */}
      <div className="card">
        <Table
          columns={['Candidate', 'Experience', 'Location', 'Key Skills', 'Expected Salary', 'Match %', 'Values', 'Actions']}
          data={filteredCandidates}
          renderRow={(candidate) => (
            <>
              <td>
                <div>
                  <p className="font-medium text-white">{candidate.name}</p>
                  <p className="text-sm text-gray-400">{candidate.email}</p>
                </div>
              </td>
              <td>{candidate.totalExperience} yrs</td>
              <td>{candidate.location}</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 2).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 2 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      +{candidate.skills.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td>{formatSalary(candidate.expectedSalary)}</td>
              <td>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        candidate.matchScore >= 80 ? 'bg-green-500' :
                        candidate.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${candidate.matchScore}%` }}
                    />
                  </div>
                  <span className={`font-bold text-sm ${
                    candidate.matchScore >= 80 ? 'text-green-400' :
                    candidate.matchScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {candidate.matchScore}%
                  </span>
                </div>
              </td>
              <td>
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View
                </button>
              </td>
              <td>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(candidate.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(candidate.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedCandidate.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCandidate.email}</p>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedCandidate.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedCandidate.location}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Experience</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedCandidate.totalExperience} years</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Expected Salary</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatSalary(selectedCandidate.expectedSalary)} LPA</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Core Values Assessment</p>
                <div className="space-y-3">
                  {Object.entries(selectedCandidate.values).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-gray-900 dark:text-white font-bold">{value.toFixed(1)}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            value >= 4 ? 'bg-green-500' :
                            value >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleApprove(selectedCandidate.id)
                    setSelectedCandidate(null)
                  }}
                  className="flex-1 btn-success"
                >
                  Approve for Interview
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedCandidate.id)
                    setSelectedCandidate(null)
                  }}
                  className="flex-1 btn-danger"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
