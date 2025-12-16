import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { searchCandidates, getAllCandidates, getJobs, type CandidateProfile } from '../../services/api'
import Table from '../../components/Table'
import Loading from '../../components/Loading'

export default function CandidateSearch() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<CandidateProfile[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchClicked, setSearchClicked] = useState(false)
  
  // Search filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('any')
  const [seniorityFilter, setSeniorityFilter] = useState<string[]>([])
  const [educationFilter, setEducationFilter] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState<string[]>([])
  const [skillsFilter, setSkillsFilter] = useState<string[]>([])
  const [valuesScore, setValuesScore] = useState(3.0)
  const [statusFilter, setStatusFilter] = useState<string[]>(['applied'])
  const [sortBy, setSortBy] = useState('ai_score')

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const jobsData = await getJobs()
      setJobs(jobsData)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() && !skillsFilter.length && !locationFilter.length && 
        !seniorityFilter.length && !educationFilter.length && experienceFilter === 'any') {
      toast.error('Please enter search criteria')
      return
    }

    setLoading(true)
    setSearchClicked(true)

    try {
      const filters: any = {}
      
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim()
      }
      
      if (selectedJob !== 'all') {
        const jobId = selectedJob.split(' - ')[0].replace('Job ID ', '')
        filters.job_id = jobId
      }
      
      if (skillsFilter.length) {
        filters.skills = skillsFilter.join(',')
      }
      
      if (locationFilter.length) {
        filters.location = locationFilter.join(',')
      }
      
      if (experienceFilter !== 'any') {
        if (experienceFilter.includes('0-2')) {
          filters.experience_min = 0
          filters.experience_max = 2
        } else if (experienceFilter.includes('2-5')) {
          filters.experience_min = 2
          filters.experience_max = 5
        } else if (experienceFilter.includes('5+')) {
          filters.experience_min = 5
        }
      }

      const results = await searchCandidates(searchQuery || '', filters)
      setCandidates(results)
      
      if (results.length === 0) {
        toast.info('No candidates found matching your criteria')
      } else {
        toast.success(`Found ${results.length} candidates`)
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search candidates')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      screened: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      shortlisted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      interviewed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      offered: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      hired: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    }
    return colors[status.toLowerCase()] || colors.applied
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur-xl border border-green-300/20 dark:border-green-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🔍 Advanced Candidate Search</h1>
        <p className="text-gray-600 dark:text-gray-400">Search and filter candidates using AI-powered semantic search</p>
      </div>

      {/* Search Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Search Candidates
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skills, experience, location..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Job
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={`Job ID ${job.id} - ${job.title}`}>
                  Job ID {job.id} - {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔧 Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="any">Any</option>
                <option value="0-2 years">0-2 years</option>
                <option value="2-5 years">2-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seniority Level
              </label>
              <div className="space-y-2">
                {['Entry-level', 'Mid-level', 'Senior', 'Lead'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={seniorityFilter.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSeniorityFilter([...seniorityFilter, level])
                        } else {
                          setSeniorityFilter(seniorityFilter.filter(l => l !== level))
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Education Level
              </label>
              <div className="space-y-2">
                {['Bachelors', 'Masters', 'PhD', 'Diploma'].map((edu) => (
                  <label key={edu} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={educationFilter.includes(edu)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEducationFilter([...educationFilter, edu])
                        } else {
                          setEducationFilter(educationFilter.filter(e => e !== edu))
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{edu}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="space-y-2">
                {['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Chennai', 'Remote'].map((loc) => (
                  <label key={loc} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={locationFilter.includes(loc)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLocationFilter([...locationFilter, loc])
                        } else {
                          setLocationFilter(locationFilter.filter(l => l !== loc))
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technical Skills
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {['Python', 'JavaScript', 'Java', 'React', 'AWS', 'Docker', 'SQL'].map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={skillsFilter.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSkillsFilter([...skillsFilter, skill])
                        } else {
                          setSkillsFilter(skillsFilter.filter(s => s !== skill))
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Values Score: {valuesScore.toFixed(1)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={valuesScore}
                onChange={(e) => setValuesScore(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="ai_score">AI Score (High to Low)</option>
                <option value="experience">Experience (High to Low)</option>
                <option value="values">Values Score (High to Low)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Candidates
            </>
          )}
        </button>
      </div>

      {/* Search Results */}
      {searchClicked && (
        <div className="card">
          {loading ? (
            <Loading message="Searching candidates..." />
          ) : candidates.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No candidates found matching your criteria</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search Results</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Found {candidates.length} candidates matching your criteria
                  </p>
                </div>
              </div>
              <Table
                columns={['Name', 'Email', 'Experience', 'Location', 'Skills', 'Status', 'Actions']}
                data={candidates}
                renderRow={(candidate: any) => (
                  <>
                    <td className="font-semibold text-gray-900 dark:text-white">{candidate.name || 'N/A'}</td>
                    <td className="text-gray-600 dark:text-gray-400">{candidate.email || 'N/A'}</td>
                    <td className="text-gray-600 dark:text-gray-400">{candidate.experience_years || 0} years</td>
                    <td className="text-gray-600 dark:text-gray-400">{candidate.location || 'N/A'}</td>
                    <td>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(candidate.skills || candidate.technical_skills || '').split(',').slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status || 'applied')}`}>
                        {(candidate.status || 'applied').charAt(0).toUpperCase() + (candidate.status || 'applied').slice(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/recruiter/feedback/${candidate.id || candidate.candidate_id}`)}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm"
                      >
                        View Details →
                      </button>
                    </td>
                  </>
                )}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

