import { useState, useEffect } from 'react'
import { getJobs, getShortlistedCandidates } from '../../services/api'
import Loading from '../../components/Loading'
import StatsCard from '../../components/StatsCard'

export default function ClientReports() {
  const [jobs, setJobs] = useState<any[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [jobsData, candidatesData] = await Promise.all([
        getJobs().catch(() => []),
        getShortlistedCandidates().catch(() => [])
      ])
      setJobs(jobsData)
      setCandidates(candidatesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalApplicants = candidates.length
  const approved = candidates.filter(c => c.status === 'approved').length
  const rejected = candidates.filter(c => c.status === 'rejected').length
  const pending = candidates.filter(c => c.status === 'pending_review').length
  const avgMatchScore = candidates.length > 0
    ? candidates.reduce((sum, c) => sum + (c.match_score || 0), 0) / candidates.length
    : 0

  if (loading) {
    return <Loading message="Loading reports..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 backdrop-blur-xl border border-purple-300/20 dark:border-purple-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📊 Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your recruitment activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applicants"
          value={totalApplicants}
          color="blue"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Approved"
          value={approved}
          color="green"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Pending Review"
          value={pending}
          color="yellow"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Avg Match Score"
          value={avgMatchScore.toFixed(1)}
          color="purple"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Job Performance */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Job Performance</h2>
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 dark:text-gray-500">No active jobs</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const jobCandidates = candidates.filter(c => c.job_title === job.title)
              const jobApproved = jobCandidates.filter(c => c.status === 'approved').length
              const jobRejected = jobCandidates.filter(c => c.status === 'rejected').length
              const jobPending = jobCandidates.filter(c => c.status === 'pending_review').length
              
              return (
                <div
                  key={job.id}
                  className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.department} • {job.location}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Candidates</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobCandidates.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{jobApproved}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{jobPending}</p>
                    </div>
                  </div>
                  
                  {jobCandidates.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Approval Rate</span>
                        <span>{((jobApproved / jobCandidates.length) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${(jobApproved / jobCandidates.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Candidate Status Breakdown */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Candidate Status Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Approved</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approved}</span>
            </div>
            <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${totalApplicants > 0 ? (approved / totalApplicants) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              {totalApplicants > 0 ? ((approved / totalApplicants) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
          
          <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending Review</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pending}</span>
            </div>
            <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${totalApplicants > 0 ? (pending / totalApplicants) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              {totalApplicants > 0 ? ((pending / totalApplicants) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
          
          <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Rejected</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">{rejected}</span>
            </div>
            <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${totalApplicants > 0 ? (rejected / totalApplicants) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              {totalApplicants > 0 ? ((rejected / totalApplicants) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

