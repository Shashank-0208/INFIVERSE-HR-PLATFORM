import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { getRecruiterJobs, bulkUploadCandidates, parsePdfCandidates, type Job } from '../../services/api'
import Loading from '../../components/Loading'

const ACCEPTED_EXTENSIONS = '.csv,.xlsx,.xls,.pdf'
const MAX_FILE_MB = 200

export type EditableCandidateRow = Record<string, string>

const COLUMNS: { key: string; label: string; required?: boolean }[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'cv_url', label: 'CV / Resume URL' },
  { key: 'phone', label: 'Phone' },
  { key: 'experience_years', label: 'Exp (years)' },
  { key: 'status', label: 'Status' },
  { key: 'location', label: 'Location' },
  { key: 'technical_skills', label: 'Skills' },
  { key: 'designation', label: 'Designation' },
  { key: 'education_level', label: 'Education' }
]

function normalizeHeader(h: string): string {
  const s = (h || '').trim().toLowerCase().replace(/\s+/g, '_')
  const map: Record<string, string> = {
    name: 'name', full_name: 'name', candidate_name: 'name',
    email: 'email', 'e-mail': 'email', email_address: 'email',
    cv_url: 'cv_url', resume_url: 'cv_url', resume: 'cv_url', cv: 'cv_url', resume_path: 'cv_url',
    phone: 'phone', phone_number: 'phone', mobile: 'phone', contact: 'phone',
    experience_years: 'experience_years', experience: 'experience_years', years_of_experience: 'experience_years', exp: 'experience_years',
    status: 'status', application_status: 'status',
    location: 'location', city: 'location', address: 'location',
    skills: 'technical_skills', technical_skills: 'technical_skills', tech_skills: 'technical_skills',
    designation: 'designation', title: 'designation', seniority_level: 'designation', level: 'designation',
    education: 'education_level', education_level: 'education_level', qualification: 'education_level'
  }
  return map[s] || s
}

function toEditableRow(raw: Record<string, unknown>): EditableCandidateRow {
  const row: EditableCandidateRow = {}
  const valuesByPosition = Object.keys(raw).length > 0 ? Object.values(raw) : []
  COLUMNS.forEach(({ key }, index) => {
    const v =
      raw[key] ??
      raw[normalizeHeader(key)] ??
      raw[`col_${index}`] ??
      (valuesByPosition[index] ?? '')
    row[key] = typeof v === 'number' ? String(v) : String(v || '').trim()
  })
  if (!row.status) row.status = 'applied'
  return row
}

function validateRow(row: EditableCandidateRow, rowIndex: number): string[] {
  const err: string[] = []
  const name = (row.name || '').trim()
  const email = (row.email || '').trim()
  if (!name) err.push(`Row ${rowIndex + 1}: Name is required`)
  if (!email) err.push(`Row ${rowIndex + 1}: Email is required`)
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.push(`Row ${rowIndex + 1}: Invalid email format`)
  const phone = (row.phone || '').trim()
  if (phone && !/^[\d\s+\-().]{7,}$/.test(phone)) err.push(`Row ${rowIndex + 1}: Invalid phone format`)
  const exp = (row.experience_years || '').trim()
  if (exp && (isNaN(Number(exp)) || Number(exp) < 0)) err.push(`Row ${rowIndex + 1}: Experience years must be a non-negative number`)
  return err
}

function validateAll(rows: EditableCandidateRow[]): { errors: string[]; valid: boolean } {
  const allErrors: string[] = []
  rows.forEach((row, i) => {
    const hasRequired = (row.name || '').trim() && (row.email || '').trim()
    if (!hasRequired) return
    allErrors.push(...validateRow(row, i))
  })
  return { errors: allErrors, valid: allErrors.length === 0 }
}

export default function BatchUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([])
  const [jobId, setJobId] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [editableRows, setEditableRows] = useState<EditableCandidateRow[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [parsing, setParsing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadRecruiterJobs()
  }, [])

  const loadRecruiterJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await getRecruiterJobs()
      setRecruiterJobs(jobsData)
      if (jobsData.length > 0) {
        setJobId((current) => {
          const exists = current && jobsData.some((j) => j.id === current)
          return exists ? current : jobsData[0].id
        })
      } else {
        setJobId('')
      }
    } catch (error) {
      console.error('Failed to load recruiter jobs:', error)
      toast.error('Failed to load your jobs. Make sure you are logged in as a recruiter.')
    } finally {
      setLoading(false)
    }
  }

  const parseFile = async (selectedFile: File): Promise<EditableCandidateRow[]> => {
    const ext = (selectedFile.name || '').toLowerCase().slice(selectedFile.name.lastIndexOf('.'))
    if (ext === '.pdf') {
      const { rows } = await parsePdfCandidates(selectedFile)
      return rows.map((r) => toEditableRow(r as Record<string, unknown>))
    }
    if (ext === '.csv') {
      const text = await selectedFile.text()
      const lines = text.split(/\r?\n/).filter((line) => line.trim())
      if (lines.length < 2) return []
      const rawHeaders = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
      const headers = rawHeaders.map(normalizeHeader)
      const rows: EditableCandidateRow[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
        const raw: Record<string, string> = {}
        headers.forEach((h, j) => { raw[h] = values[j] ?? '' })
        rows.push(toEditableRow(raw))
      }
      return rows
    }
    if (ext === '.xlsx' || ext === '.xls') {
      const buf = await selectedFile.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const firstSheet = wb.SheetNames[0]
      const sheet = wb.Sheets[firstSheet]
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown as unknown[][]
      if (data.length < 2) return []
      const rawHeaders = (data[0] as unknown[]).map((h) => String(h ?? '').trim())
      const headers = rawHeaders.map(normalizeHeader)
      const rows: EditableCandidateRow[] = []
      for (let i = 1; i < data.length; i++) {
        const values = (data[i] as unknown[]) || []
        const raw: Record<string, string> = {}
        headers.forEach((h, j) => { raw[h] = String(values[j] ?? '').trim() })
        rows.push(toEditableRow(raw))
      }
      return rows
    }
    return []
  }

  const allowedExt = (name: string) => {
    const ext = (name || '').toLowerCase().slice(name.lastIndexOf('.'))
    return ['.csv', '.xlsx', '.xls', '.pdf'].includes(ext)
  }

  const handleFilesAdded = async (newFiles: FileList | File[]) => {
    const list = Array.from(newFiles).filter((f) => allowedExt(f.name))
    if (list.length === 0) {
      toast.error('Please upload CSV, Excel (XLS/XLSX), or PDF files')
      return
    }
    for (const f of list) {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${f.name} exceeds ${MAX_FILE_MB}MB. Skipped.`)
        continue
      }
    }
    setParsing(true)
    setValidationErrors([])
    try {
      let allRows: EditableCandidateRow[] = []
      for (const file of list) {
        const rows = await parseFile(file)
        allRows = allRows.concat(rows)
      }
      setFiles((prev) => [...prev, ...list])
      setEditableRows((prev) => (prev.length === 0 && allRows.length > 0 ? allRows : [...prev, ...allRows]))
      if (allRows.length > 0) {
        toast.success(`Parsed ${allRows.length} row(s) from ${list.length} file(s). Edit below and upload when ready.`)
      } else {
        toast.error('No rows found in the selected file(s). Check format (e.g. header row + data).')
      }
    } catch (e: unknown) {
      console.error('Parse error:', e)
      toast.error((e as Error)?.message || 'Failed to parse file(s)')
    } finally {
      setParsing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList?.length) handleFilesAdded(fileList)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const list = e.dataTransfer.files
    if (list?.length) handleFilesAdded(list)
  }

  const clearAllFiles = () => {
    setFiles([])
    setEditableRows([])
    setValidationErrors([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFileInputKey((k) => k + 1)
  }

  const updateRow = (rowIndex: number, key: string, value: string) => {
    setEditableRows((prev) => {
      const next = [...prev]
      if (!next[rowIndex]) return next
      next[rowIndex] = { ...next[rowIndex], [key]: value }
      return next
    })
    setValidationErrors((prev) => prev.filter((e) => !e.startsWith(`Row ${rowIndex + 1}:`)))
  }

  const removeRow = (rowIndex: number) => {
    setEditableRows((prev) => prev.filter((_, i) => i !== rowIndex))
    setValidationErrors((prev) => prev.filter((e) => {
      const m = e.match(/^Row (\d+):/)
      const row = m ? Number(m[1]) : 0
      return row !== rowIndex + 1
    }))
  }

  const addEmptyRow = () => {
    const empty: EditableCandidateRow = {}
    COLUMNS.forEach(({ key }) => { empty[key] = '' })
    empty.status = 'applied'
    setEditableRows((prev) => [...prev, empty])
  }

  const handleUpload = async () => {
    if (!jobId) {
      toast.error('Please select a job')
      return
    }
    const rowsToSubmit = editableRows.filter((r) => (r.name || '').trim() || (r.email || '').trim())
    if (rowsToSubmit.length === 0) {
      toast.error('No candidate data to upload. Add or keep at least one row with name and email.')
      return
    }
    const { errors, valid } = validateAll(rowsToSubmit)
    if (!valid) {
      setValidationErrors(errors)
      toast.error(`Fix ${errors.length} validation error(s) before uploading. See table below.`)
      return
    }
    setValidationErrors([])
    setUploading(true)
    try {
      const candidates = rowsToSubmit.map((row) => ({
        name: (row.name || '').trim(),
        email: (row.email || '').trim(),
        cv_url: (row.cv_url || '').trim() || undefined,
        phone: (row.phone || '').trim() || undefined,
        experience_years: (row.experience_years || '').trim() ? parseInt(row.experience_years, 10) || 0 : 0,
        status: (row.status || '').trim() || 'applied',
        location: (row.location || '').trim() || undefined,
        technical_skills: (row.technical_skills || '').trim() || undefined,
        designation: (row.designation || '').trim() || undefined,
        education_level: (row.education_level || '').trim() || undefined
      }))
      const result = await bulkUploadCandidates(candidates, jobId)
      const inserted = result?.candidates_inserted ?? candidates.length
      toast.success(`Uploaded ${inserted} candidate(s) for this job. Dashboard counts are updated.`)
      setFiles([])
      setEditableRows([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      setFileInputKey((k) => k + 1)
      if (result?.errors?.length) {
        toast.error(`Some rows had errors: ${(result.errors as string[]).slice(0, 3).join('; ')}`)
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      const msg = err?.response?.data?.error || (err as Error)?.message || 'Upload failed'
      toast.error(msg)
      // Keep editableRows so user can fix and retry (persistent error handling)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <Loading message="Loading jobs..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="page-title">Bulk Candidate Upload</h1>
            <p className="page-subtitle">
              Upload candidates from CSV, Excel (XLS/XLSX), or PDF. Edit the preview table below, then upload. Applicant counts sync to the dashboard.
            </p>
          </div>
          <Link
            to="/recruiter"
            className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard overview
          </Link>
        </div>
      </div>

      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select job for upload</label>
        {recruiterJobs.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No jobs posted yet. Create a job from the dashboard first.</p>
        ) : (
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select a job</option>
            {recruiterJobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title} – Job ID {job.id}</option>
            ))}
          </select>
        )}
      </div>

      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supported formats</label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          CSV, Excel (XLS/XLSX), or PDF. Max {MAX_FILE_MB}MB. First row can be headers (Name, Email, etc.).
        </p>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Drag and drop file here, or browse</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">CSV, XLS, XLSX, PDF • Max {MAX_FILE_MB}MB • Multiple files allowed</p>
          <button type="button" className="btn-secondary mt-2" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>Browse files</button>
        </div>
        <input
          key={fileInputKey}
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        {files.length > 0 && (
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {files.length} file(s): {files.map((f) => f.name).join(', ')}
              </span>
              <button type="button" onClick={clearAllFiles} className="text-red-500 hover:text-red-700 dark:text-red-400 font-medium">Clear all & start over</button>
            </div>
          </div>
        )}

        {parsing && <p className="mt-2 text-sm text-gray-500">Parsing file…</p>}
      </div>

      {validationErrors.length > 0 && (
        <div className="card border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Validation errors – fix these before uploading</h3>
          <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1">
            {validationErrors.slice(0, 10).map((msg, i) => <li key={i}>{msg}</li>)}
            {validationErrors.length > 10 && <li>… and {validationErrors.length - 10} more</li>}
          </ul>
        </div>
      )}

      {editableRows.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Edit candidate data (required: Name, Email)</h2>
            <div className="flex gap-2">
              <button type="button" onClick={addEmptyRow} className="btn-outline text-sm py-1.5 px-3">Add row</button>
            </div>
          </div>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">
                      {col.label}{col.required ? ' *' : ''}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {editableRows.map((row, rowIndex) => {
                  const rowErrs = validationErrors.filter((e) => e.startsWith(`Row ${rowIndex + 1}:`))
                  return (
                    <tr key={rowIndex} className={rowErrs.length ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}>
                      {COLUMNS.map((col) => (
                        <td key={col.key} className="px-2 py-1">
                          <input
                            type="text"
                            value={row[col.key] ?? ''}
                            onChange={(e) => updateRow(rowIndex, col.key, e.target.value)}
                            placeholder={col.required ? 'Required' : ''}
                            className="w-full min-w-[80px] px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1">
                        <button type="button" onClick={() => removeRow(rowIndex)} className="text-red-500 hover:text-red-700 dark:text-red-400 text-sm">Remove</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || editableRows.length === 0}
            className="btn-primary w-full mt-6"
          >
            {uploading ? (
              <><span className="animate-spin mr-2">⏳</span> Uploading…</>
            ) : (
              <>Upload Candidates</>
            )}
          </button>
        </div>
      )}

      {!editableRows.length && !parsing && files.length > 0 && (
        <p className="text-sm text-gray-500">No rows could be parsed. Try a different file or check the format.</p>
      )}
    </div>
  )
}
