import { Routes, Route, Navigate } from 'react-router-dom'

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard'
import JobCreation from './pages/recruiter/JobCreation'
import ApplicantsMatching from './pages/recruiter/ApplicantsMatching'
import FeedbackForm from './pages/recruiter/FeedbackForm'
import AutomationPanel from './pages/recruiter/AutomationPanel'

// Candidate Pages
import CandidateLogin from './pages/candidate/Login'
import CandidateProfile from './pages/candidate/Profile'
import AppliedJobs from './pages/candidate/AppliedJobs'
import InterviewTaskPanel from './pages/candidate/InterviewTaskPanel'
import CandidateFeedback from './pages/candidate/Feedback'

// Client Pages
import ClientDashboard from './pages/client/Dashboard'
import ShortlistReview from './pages/client/ShortlistReview'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/recruiter" replace />} />

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<RecruiterDashboard />} />
      <Route path="/recruiter/create-job" element={<JobCreation />} />
      <Route path="/recruiter/applicants/:jobId" element={<ApplicantsMatching />} />
      <Route path="/recruiter/feedback/:candidateId" element={<FeedbackForm />} />
      <Route path="/recruiter/automation" element={<AutomationPanel />} />

      {/* Candidate Routes */}
      <Route path="/candidate" element={<CandidateLogin />} />
      <Route path="/candidate/profile" element={<CandidateProfile />} />
      <Route path="/candidate/applied-jobs" element={<AppliedJobs />} />
      <Route path="/candidate/interviews" element={<InterviewTaskPanel />} />
      <Route path="/candidate/feedback" element={<CandidateFeedback />} />

      {/* Client Routes */}
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/client/shortlist/:jobId" element={<ShortlistReview />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/recruiter" replace />} />
    </Routes>
  )
}
