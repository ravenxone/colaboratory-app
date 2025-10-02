'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const DEFAULT_SKILLS = ['Engineering', 'Design', 'Marketing', 'Product', 'Business Development']

type Project = {
  id: string
  title: string
  description: string
  video_url: string
  user_problem: string
  roles_needed: string[]
  created_at: string
  profiles: {
    full_name: string
    email: string
    twitter: string | null
    linkedin: string | null
    phone: string | null
  }
}

export default function ProjectDetail({
  project,
  currentUser
}: {
  project: Project
  currentUser: User | null
}) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    skills: [] as string[],
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.skills.length === 0) {
      setError('Please select at least one skill')
      setLoading(false)
      return
    }

    const { error: submitError } = await supabase
      .from('collaboration_requests')
      .insert({
        project_id: project.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        skills: formData.skills,
        message: formData.message
      })

    if (submitError) {
      setError(submitError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        skills: [],
        message: ''
      })
    }
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Loom
    if (url.includes('loom.com')) {
      const videoId = url.split('share/')[1]?.split('?')[0]
      return `https://www.loom.com/embed/${videoId}`
    }
    return url
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <span>Posted by {project.profiles.full_name}</span>
                <span>•</span>
                <span>{formatDate(project.created_at)}</span>
              </div>

              {/* Poster Credentials */}
              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href={`mailto:${project.profiles.email}`}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                >
                  Email
                </a>
                {project.profiles.twitter && (
                  <>
                    <span className="text-gray-300">|</span>
                    <a
                      href={project.profiles.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Twitter
                    </a>
                  </>
                )}
                {project.profiles.linkedin && (
                  <>
                    <span className="text-gray-300">|</span>
                    <a
                      href={project.profiles.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                    >
                      LinkedIn
                    </a>
                  </>
                )}
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>

            {/* User Problem */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">User Problem</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{project.user_problem}</p>
            </div>

            {/* Looking For */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Looking for</h2>
              <div className="flex flex-wrap gap-2">
                {project.roles_needed.map(role => (
                  <span
                    key={role}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Video */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Video</h3>
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(project.video_url)}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Collaboration Form */}
            {!currentUser ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600 mb-4">Sign in to collaborate on this project</p>
                <a
                  href="/login"
                  className="block w-full text-center px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700"
                >
                  Sign in
                </a>
              </div>
            ) : success ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Request sent!</h3>
                  <p className="text-gray-600 text-sm">
                    The project owner will review your request and get back to you.
                  </p>
                </div>
              </div>
            ) : !showForm ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested?</h3>
                <p className="text-gray-600 mb-4">Reach out to collaborate on this project</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700"
                >
                  I want to collaborate
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborate</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Skills *
                    </label>
                    <div className="space-y-2">
                      {DEFAULT_SKILLS.map(skill => (
                        <label key={skill} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            checked={formData.skills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                          />
                          <span className="ml-2 text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Why do you want to collaborate? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
