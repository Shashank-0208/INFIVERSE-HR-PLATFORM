import { useNavigate } from 'react-router-dom'

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('user_name') || 'Candidate'

  const stats = [
    { label: 'Applied Jobs', value: '12', icon: '📝', color: 'from-blue-500 to-cyan-500' },
    { label: 'Interviews Scheduled', value: '3', icon: '📅', color: 'from-emerald-500 to-teal-500' },
    { label: 'Profile Views', value: '48', icon: '👁️', color: 'from-purple-500 to-pink-500' },
    { label: 'Shortlisted', value: '5', icon: '⭐', color: 'from-amber-500 to-orange-500' },
  ]

  const recentApplications = [
    { id: 1, company: 'Tech Corp', position: 'Senior Developer', status: 'Under Review', date: '2024-12-10' },
    { id: 2, company: 'StartupXYZ', position: 'Full Stack Engineer', status: 'Interview Scheduled', date: '2024-12-09' },
    { id: 3, company: 'BigTech Inc', position: 'Software Architect', status: 'Shortlisted', date: '2024-12-08' },
  ]

  const upcomingInterviews = [
    { id: 1, company: 'StartupXYZ', position: 'Full Stack Engineer', date: '2024-12-15', time: '10:00 AM' },
    { id: 2, company: 'Innovation Labs', position: 'Backend Developer', date: '2024-12-18', time: '2:00 PM' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-blue-100 text-lg">Track your job applications and upcoming interviews</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-20`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Applications</h2>
            <button
              onClick={() => navigate('/candidate/applied-jobs')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{app.position}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.company}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'Shortlisted'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : app.status === 'Interview Scheduled'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{app.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Interviews</h2>
            <button
              onClick={() => navigate('/candidate/interviews')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{interview.position}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{interview.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600 dark:text-blue-400">{interview.date}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{interview.time}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                    Join Meeting
                  </button>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/candidate/profile')}
            className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-center"
          >
            <span className="text-2xl mb-2 block">📝</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Profile</span>
          </button>
          <button
            onClick={() => navigate('/candidate/jobs')}
            className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-center"
          >
            <span className="text-2xl mb-2 block">🔍</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Browse Jobs</span>
          </button>
          <button
            onClick={() => navigate('/candidate/applied-jobs')}
            className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-center"
          >
            <span className="text-2xl mb-2 block">📋</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Track Applications</span>
          </button>
          <button
            onClick={() => navigate('/candidate/feedback')}
            className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-center"
          >
            <span className="text-2xl mb-2 block">💬</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Feedback</span>
          </button>
        </div>
      </div>
    </div>
  )
}
