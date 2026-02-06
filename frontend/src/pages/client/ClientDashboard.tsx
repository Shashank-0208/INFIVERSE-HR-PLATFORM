import { useState, useEffect } from 'react'
import { getClientJobs, getClientStats, getClientProfile, Job, ClientStats } from '../../services/api'
import StatsCard from '../../components/StatsCard'
import Loading from '../../components/Loading'
import { toast } from 'react-hot-toast'

export default function ClientDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<ClientStats | null>(null)
  const [connectionId, setConnectionId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    // Auto-refresh every 30 seconds for real-time data
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  // All data is client-scoped: APIs use logged-in client's JWT; backend returns only this client's jobs
  // (including jobs recruiters posted via this client's connection_id). No client_id param is sent.
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [jobsData, statsData, profile] = await Promise.all([
        getClientJobs().catch(() => []),
        getClientStats(),
        getClientProfile()
      ])
      setJobs(Array.isArray(jobsData) ? jobsData : [])
      setStats(statsData ?? null)
      setConnectionId(profile?.connection_id ?? '')
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyConnectionId = async () => {
    if (!connectionId) return
    try {
      await navigator.clipboard.writeText(connectionId)
      toast.success('Connection ID copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }

  // Use stats from dedicated client/stats endpoint (DB counts only)
  const activeJobs = stats?.active_jobs ?? jobs.filter(job => job.status === 'active' || !job.status).length
  const totalApplications = stats?.total_applications ?? 0
  const interviewsScheduled = stats?.interviews_scheduled ?? 0
  const offersMade = stats?.offers_made ?? 0

  // Pipeline data from stats (no match/top; shortlisted = screened/reviewed)
  const applied = totalApplications
  const shortlisted = stats?.shortlisted ?? 0
  const aiScreened = shortlisted
  const reviewed = shortlisted
  const interview = interviewsScheduled
  const offer = offersMade
  const hired = stats?.hired ?? 0

  // Conversion rates
  const conversionRates = {
    appliedToScreened: applied > 0 ? Math.round((aiScreened / applied) * 100) : 0,
    screenedToReviewed: aiScreened > 0 ? Math.round((reviewed / aiScreened) * 100) : 0,
    reviewedToInterview: reviewed > 0 ? Math.round((interview / reviewed) * 100) : 0,
    interviewToOffer: interview > 0 ? Math.round((offer / interview) * 100) : 0,
    offerToHired: offer > 0 ? Math.round((hired / offer) * 100) : 0,
  }

  if (loading) {
    return <Loading message="Loading dashboard..." />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">BHIV Client Portal</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Dedicated Client Interface for Job Posting & Candidate Review</p>
        </div>
      </div>

      {/* Connection ID – share with recruiters for real-time job linking */}
      {connectionId && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-300/20 dark:border-emerald-500/20">
          <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Recruiter connection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Share this ID with recruiters so they can post jobs for you and you can see activity in real time.</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-900 dark:text-white break-all">
              {connectionId}
            </code>
            <button
              type="button"
              onClick={copyConnectionId}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Client Reports & Analytics */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Client Reports & Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Active Jobs"
            value={activeJobs}
            color="blue"
            trend={{ value: 4, label: 'recent' }}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            color="green"
            trend={{ value: 0, label: 'this week' }}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Interviews Scheduled"
            value={interviewsScheduled}
            color="yellow"
            trend={{ value: 0, label: 'this week' }}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Offers Made"
            value={offersMade}
            color="purple"
            trend={{ value: 0, label: 'this week' }}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Application Pipeline */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Application Pipeline
        </h2>
        
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Your pipeline: {totalApplications} candidates and {activeJobs} active jobs (only your company’s data; includes jobs recruiters posted using your Connection ID).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pipeline Data */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Applied</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{applied}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">AI Screened</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{aiScreened}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Reviewed</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{reviewed}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Interview</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{interview}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Offer</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{offer}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Hired</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{hired}</span>
              </div>
            </div>
          </div>

          {/* Conversion Rates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Rates (Based on Real Data)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Applied → AI Screened</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{conversionRates.appliedToScreened}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">AI Screened → Reviewed</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{conversionRates.screenedToReviewed}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Reviewed → Interview</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{conversionRates.reviewedToInterview}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Interview → Offer</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{conversionRates.interviewToOffer}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Offer → Hired</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{conversionRates.offerToHired}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
