import { useState, useEffect } from 'react'
import { getCandidateFeedback } from '../../services/api'
import Loading from '../../components/Loading'

export default function CandidateFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const candidateId = localStorage.getItem('candidate_id') || 'demo-candidate'
      const data = await getCandidateFeedback(candidateId)
      setFeedbacks(data)
    } catch (error) {
      console.error('Failed to load feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const coreValues = ['Integrity', 'Honesty', 'Discipline', 'Hard Work', 'Gratitude']

  const getDecisionColor = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'accept':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'reject':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'hold':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'task':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return <Loading message="Loading feedback..." />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employer Feedback</h1>
        <p className="text-gray-400">View feedback and assessments from employers</p>
      </div>

      {/* Core Values Overview */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Your Core Values</h2>
        <p className="text-gray-400 text-sm mb-6">
          These values are assessed by employers based on your interviews and interactions
        </p>
        
        <div className="flex flex-wrap gap-3">
          {coreValues.map((value) => (
            <div
              key={value}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
            >
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {feedbacks.length === 0 ? (
        <div className="card text-center py-12">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="text-gray-400 text-lg">No feedback received yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Feedback will appear here after your interviews
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{feedback.jobTitle}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(feedback.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDecisionColor(feedback.decision)}`}>
                  {feedback.decision}
                </span>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Feedback Comment</h4>
                <p className="text-gray-300 bg-gray-700 rounded-lg p-4">
                  {feedback.comment}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Values Assessment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(feedback.values).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 capitalize text-sm font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-white font-bold">{value.toFixed(1)}/5</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
