import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 mt-16 p-8 animate-fade-in">
              <AppRoutes />
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: 'dark:bg-gray-900 dark:text-gray-100',
              style: {
                background: 'var(--toast-bg, #ffffff)',
                color: 'var(--toast-color, #1f2937)',
                border: '2px solid var(--toast-border, #e5e7eb)',
                borderRadius: '12px',
                padding: '16px',
                fontWeight: '600',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
