'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const DEFAULT_ROLES = ['Engineer', 'Designer', 'Marketer']

type Project = {
  id: string
  title: string
  description: string
  roles_needed: string[]
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

export default function ProjectBoard({ initialProjects }: { initialProjects: Project[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const router = useRouter()

  // Get all unique roles from projects
  const allRoles = useMemo(() => {
    const rolesSet = new Set(DEFAULT_ROLES)
    initialProjects.forEach(project => {
      project.roles_needed.forEach(role => rolesSet.add(role))
    })
    return Array.from(rolesSet).sort()
  }, [initialProjects])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return initialProjects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Role filter
      const matchesRole = selectedRoles.length === 0 ||
        selectedRoles.some(role => project.roles_needed.includes(role))

      return matchesSearch && matchesRole
    })
  }, [initialProjects, searchQuery, selectedRoles])

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            USC Student Projects
          </h1>
          <p className="text-gray-600">
            Find collaborators for your next big idea
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">
              Filter by role:
            </span>
            {allRoles.map(role => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRoles.includes(role)
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {role}
              </button>
            ))}
            {selectedRoles.length > 0 && (
              <button
                onClick={() => setSelectedRoles([])}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                    {formatDate(project.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.roles_needed.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    by {project.profiles.full_name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
