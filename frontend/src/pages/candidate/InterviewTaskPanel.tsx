import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getInterviews, getTasks, markTaskSubmitted } from '../../services/api'
import Loading from '../../components/Loading'

export default function InterviewTaskPanel() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const candidateId = localStorage.getItem('candidate_id') || 'demo-candidate'
      const [interviewsData, tasksData] = await Promise.all([
        getInterviews(candidateId),
        getTasks(candidateId)
      ])
      setInterviews(interviewsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSubmitted = async (taskId: string) => {
    try {
      await markTaskSubmitted(taskId)
      toast.success('Task marked as submitted!')
      loadData()
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date)
    return `${dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })} at ${time}`
  }

  if (loading) {
    return <Loading message="Loading interviews and tasks..." />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Interviews & Tasks</h1>
        <p className="text-gray-400">Manage your upcoming interviews and assigned tasks</p>
      </div>

      {/* Upcoming Interviews */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Upcoming Interviews</h2>
          <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm font-medium">
            {interviews.length} Scheduled
          </span>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-400">No upcoming interviews</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{interview.jobTitle}</h3>
                    <p className="text-gray-400">{interview.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium">
                    {interview.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">
                      {formatDateTime(interview.date, interview.time)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">Video Interview</span>
                  </div>
                </div>

                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Join Meeting</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Assigned Tasks</h2>
          <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm font-medium">
            {tasks.filter(t => t.status === 'pending').length} Pending
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-400">No tasks assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{task.taskTitle}</h3>
                    <p className="text-gray-400 text-sm">{task.jobTitle}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'pending' 
                      ? 'bg-yellow-900 text-yellow-300' 
                      : 'bg-green-900 text-green-300'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{task.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-400">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleMarkSubmitted(task.id)}
                      className="btn-success"
                    >
                      Mark as Submitted
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
