import { Outlet } from 'react-router-dom'
import RoleNavbar from '../navbars/RoleNavbar'
import CandidateSidebar from '../sidebars/CandidateSidebar'
import { SidebarProvider, useSidebar } from '../../context/SidebarContext'

function CandidateLayoutContent() {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <RoleNavbar role="candidate" />
      <div className="flex">
        <CandidateSidebar />
        <main className={`flex-1 mt-16 p-8 animate-fade-in transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function CandidateLayout() {
  return (
    <SidebarProvider>
      <CandidateLayoutContent />
    </SidebarProvider>
  )
}
