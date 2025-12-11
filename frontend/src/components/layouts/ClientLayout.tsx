import { Outlet } from 'react-router-dom'
import RoleNavbar from '../navbars/RoleNavbar'
import ClientSidebar from '../sidebars/ClientSidebar'

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <RoleNavbar role="client" />
      <div className="flex">
        <ClientSidebar />
        <main className="flex-1 ml-64 mt-16 p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
