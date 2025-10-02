'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Project = {
  id: string
  title: string
  description: string
  status: 'open' | 'closed'
  created_at: string
  roles_needed: string[]
}

type CollaborationRequest = {
  id: string
  project_id: string
  full_name: string
  email: string
  phone: string | null
  skills: string[]
  message: string
  created_at: string
  projects: {
    title: string
    id: string
  }
}

export default function Dashboard({
  projects,
  collaborationRequests
}: {
  projects: Project[]
  collaborationRequests: CollaborationRequest[]
}) {
  const [activeTab, setActiveTab] = useState<'projects' | 'requests'>('projects')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusToggle = async (projectId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open'
    await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', projectId)

    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredRequests = selectedProject
    ? collaborationRequests.filter(r => r.project_id === selectedProject)
    : collaborationRequests

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Collaboration Requests ({collaborationRequests.length})
            </button>
          </nav>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">You haven&apos;t posted any projects yet</p>
                <button
                  onClick={() => router.push('/post')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  Post Your First Project
                </button>
              </div>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {project.title}
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'open'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.roles_needed.map(role => (
                          <span
                            key={role}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        Posted on {formatDate(project.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      View Project
                    </button>
                    <button
                      onClick={() => handleStatusToggle(project.id, project.status)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Mark as {project.status === 'open' ? 'Closed' : 'Open'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(project.id)
                        setActiveTab('requests')
                      }}
                      className="px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-md hover:bg-orange-50"
                    >
                      View Requests (
                      {collaborationRequests.filter(r => r.project_id === project.id).length}
                      )
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Collaboration Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {/* Project Filter */}
            {projects.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by project
                </label>
                <select
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(e.target.value || null)}
                >
                  <option value="">All projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    {selectedProject
                      ? 'No collaboration requests for this project yet'
                      : 'No collaboration requests yet'}
                  </p>
                </div>
              ) : (
                filteredRequests.map(request => (
                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.full_name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-orange-600 mb-3">
                        For: {request.projects.title}
                      </p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Contact</p>
                        <p className="text-sm text-gray-600">
                          <a
                            href={`mailto:${request.email}`}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            {request.email}
                          </a>
                          {request.phone && (
                            <>
                              {' • '}
                              <a
                                href={`tel:${request.phone}`}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                {request.phone}
                              </a>
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {request.skills.map(skill => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {request.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`mailto:${request.email}?subject=Re: Collaboration on ${request.projects.title}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        Reply via Email
                      </a>
                      {request.phone && (
                        <a
                          href={`tel:${request.phone}`}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
