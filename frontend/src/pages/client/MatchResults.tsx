import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getShortlistedCandidates, reviewCandidate, getJobs, type ShortlistedCandidate } from '../../services/api'
import Loading from '../../components/Loading'

export default function MatchResults() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<ShortlistedCandidate[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [selectedCandidate, setSelectedCandidate] = useState<ShortlistedCandidate | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [candidatesData, jobsData] = await Promise.all([
        getShortlistedCandidates().catch(() => []),
        getJobs().catch(() => [])
      ])
      setCandidates(candidatesData)
      setJobs(jobsData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load match results')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (candidateId: string, decision: 'approved' | 'rejected', notes?: string) => {
    try {
      await reviewCandidate(candidateId, decision, notes)
      toast.success(`Candidate ${decision === 'approved' ? 'approved' : 'rejected'} successfully`)
      loadData()
      setSelectedCandidate(null)
    } catch (error) {
      toast.error(`Failed to ${decision} candidate`)
    }
  }

  const filteredCandidates = selectedJob === 'all' 
    ? candidates 
    : candidates.filter(c => c.job_title === selectedJob)

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    if (score >= 60) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || colors.pending_review
  }

  if (loading) {
    return <Loading message="Loading match results..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 backdrop-blur-xl border border-purple-300/20 dark:border-purple-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🎯 Match Results</h1>
        <p className="text-gray-600 dark:text-gray-400">Review AI-matched candidates for your job openings</p>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Job
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.title}>
                  {job.title} - {job.department}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Matches</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredCandidates.length}</p>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No match results available</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Candidates will appear here once they are shortlisted</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              {/* Candidate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{candidate.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                  {candidate.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Match Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score</span>
                  <span className={`text-2xl font-bold ${getMatchScoreColor(candidate.match_score).split(' ')[0]} ${getMatchScoreColor(candidate.match_score).split(' ')[1]}`}>
                    {candidate.match_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      candidate.match_score >= 80 ? 'bg-emerald-500' :
                      candidate.match_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${candidate.match_score}%` }}
                  />
                </div>
              </div>

              {/* Job Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Applied Position</p>
                <p className="font-semibold text-gray-900 dark:text-white">{candidate.job_title}</p>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 4 && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                      +{candidate.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                <p className="font-semibold text-gray-900 dark:text-white">{candidate.experience_years} years</p>
              </div>

              {/* Recruiter Notes */}
              {candidate.recruiter_notes && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Recruiter Notes</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">{candidate.recruiter_notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  View Details
                </button>
                {candidate.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => handleReview(candidate.id, 'approved')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleReview(candidate.id, 'rejected')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCandidate.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{selectedCandidate.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Match Score</p>
                  <p className={`text-3xl font-bold ${getMatchScoreColor(selectedCandidate.match_score).split(' ')[1]}`}>
                    {selectedCandidate.match_score}%
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Applied Position</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedCandidate.job_title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-medium text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Experience</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedCandidate.experience_years} years</p>
                </div>

                {selectedCandidate.recruiter_notes && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Recruiter Notes</p>
                    <p className="text-blue-600 dark:text-blue-300">{selectedCandidate.recruiter_notes}</p>
                  </div>
                )}

                {selectedCandidate.status === 'pending_review' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        handleReview(selectedCandidate.id, 'approved')
                      }}
                      className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Approve Candidate
                    </button>
                    <button
                      onClick={() => {
                        handleReview(selectedCandidate.id, 'rejected')
                      }}
                      className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Reject Candidate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

