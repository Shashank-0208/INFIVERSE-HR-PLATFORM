import { Outlet } from 'react-router-dom'
import RoleNavbar from '../navbars/RoleNavbar'
import CandidateSidebar from '../sidebars/CandidateSidebar'

export default function CandidateLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <RoleNavbar role="candidate" />
      <div className="flex">
        <CandidateSidebar />
        <main className="flex-1 ml-64 mt-16 p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
