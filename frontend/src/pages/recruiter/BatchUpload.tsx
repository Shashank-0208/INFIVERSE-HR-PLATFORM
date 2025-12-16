import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getJobs, bulkUploadCandidates } from '../../services/api'
import Loading from '../../components/Loading'

interface CSVRow {
  name: string
  email: string
  cv_url?: string
  phone?: string
  experience_years?: number
  status?: string
  location?: string
  skills?: string
  designation?: string
  education?: string
}

export default function BatchUpload() {
  const navigate = useNavigate()
  const [jobId, setJobId] = useState<number>(1)
  const [jobs, setJobs] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<CSVRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await getJobs()
      setJobs(jobsData)
      if (jobsData.length > 0) {
        setJobId(jobsData[0].id)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file')
        return
      }
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const data: CSVRow[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row as CSVRow)
      }
      
      setPreview(data.slice(0, 10)) // Show first 10 rows
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file')
      return
    }

    if (!jobId) {
      toast.error('Please select a job')
      return
    }

    setUploading(true)
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const candidates: any[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        
        // Clean and validate data
        const expYears = row.experience_years ? parseInt(row.experience_years) || 0 : 0
        
        const candidate = {
          name: (row.name || '').trim(),
          email: (row.email || '').trim(),
          cv_url: (row.cv_url || '').trim(),
          phone: (row.phone || '').trim(),
          experience_years: expYears,
          status: (row.status || 'applied').trim(),
          job_id: jobId,
          location: (row.location || '').trim(),
          technical_skills: (row.skills || '').trim(),
          designation: (row.designation || '').trim(),
          education_level: (row.education || '').trim()
        }
        
        if (candidate.name && candidate.email) {
          candidates.push(candidate)
        }
      }

      if (candidates.length === 0) {
        toast.error('No valid candidates found in CSV')
        setUploading(false)
        return
      }

      // Upload to API
      const result = await bulkUploadCandidates(candidates)
      
      if (result) {
        toast.success(`Successfully uploaded ${candidates.length} candidates for Job ID: ${jobId}`)
        setFile(null)
        setPreview([])
        // Reset file input
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error?.response?.data?.error || 'Failed to upload candidates')
    } finally {
      setUploading(false)
    }
  }

  const exampleData = [
    { name: 'John Smith', email: 'john@example.com', cv_url: 'https://example.com/john-cv.pdf', phone: '+1-555-0101', experience_years: 5, status: 'applied' },
    { name: 'Jane Doe', email: 'jane@example.com', cv_url: 'https://example.com/jane-cv.pdf', phone: '+1-555-0102', experience_years: 3, status: 'applied' },
    { name: 'Mike Johnson', email: 'mike@example.com', cv_url: 'https://example.com/mike-cv.pdf', phone: '+1-555-0103', experience_years: 7, status: 'applied' }
  ]

  if (loading) {
    return <Loading message="Loading jobs..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📤 Bulk Candidate Upload</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload multiple candidates for a job position using CSV format</p>
      </div>

      {/* Job Selection */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Job
        </label>
        <select
          value={jobId}
          onChange={(e) => setJobId(parseInt(e.target.value))}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              Job ID {job.id} - {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Expected CSV Format */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📋 Expected CSV Format</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">cv_url</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">experience_years</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {exampleData.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.cv_url}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.experience_years}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Optional fields: location, skills, designation, education
        </p>
      </div>

      {/* File Upload */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload CSV File</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose CSV file
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100
                dark:file:bg-green-900/30 dark:file:text-green-400
                dark:hover:file:bg-green-900/50"
            />
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview of uploaded data ({preview.length} rows shown)
              </h3>
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {preview.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value, valIdx) => (
                          <td key={valIdx} className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {String(value || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Candidates
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

