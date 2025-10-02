'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const DEFAULT_ROLES = ['Engineer', 'Designer', 'Marketer']

export default function PostProjectForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    user_problem: '',
    talked_to_users: false,
    roles_needed: [] as string[],
    custom_role: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles_needed: prev.roles_needed.includes(role)
        ? prev.roles_needed.filter(r => r !== role)
        : [...prev.roles_needed, role]
    }))
  }

  const addCustomRole = () => {
    if (formData.custom_role.trim() && !formData.roles_needed.includes(formData.custom_role.trim())) {
      setFormData(prev => ({
        ...prev,
        roles_needed: [...prev.roles_needed, prev.custom_role.trim()],
        custom_role: ''
      }))
    }
  }

  const removeRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles_needed: prev.roles_needed.filter(r => r !== role)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!formData.talked_to_users) {
      setError('Please confirm that you have talked to users')
      setLoading(false)
      return
    }

    if (formData.roles_needed.length === 0) {
      setError('Please select at least one role you are looking for')
      setLoading(false)
      return
    }

    if (!formData.video_url.includes('youtube.com') &&
        !formData.video_url.includes('youtu.be') &&
        !formData.video_url.includes('loom.com')) {
      setError('Please provide a valid YouTube or Loom URL')
      setLoading(false)
      return
    }

    const { data, error: submitError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
        user_problem: formData.user_problem,
        talked_to_users: formData.talked_to_users,
        roles_needed: formData.roles_needed,
        status: 'open'
      })
      .select()
      .single()

    if (submitError) {
      setError(submitError.message)
      setLoading(false)
    } else {
      router.push(`/projects/${data.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Project</h1>
          <p className="text-gray-600 mb-8">
            Find USC students to collaborate with on your project
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Building a student marketplace app"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Describe your project, what you're building, and your vision..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (YouTube or Loom) *
              </label>
              <input
                type="url"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://www.youtube.com/watch?v=... or https://www.loom.com/share/..."
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload a video explaining your project to YouTube or Loom
              </p>
            </div>

            {/* User Validation */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="talked_to_users"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
                  checked={formData.talked_to_users}
                  onChange={(e) => setFormData({...formData, talked_to_users: e.target.checked})}
                />
                <label htmlFor="talked_to_users" className="ml-3 block text-sm font-medium text-gray-700">
                  I have talked to potential users about this problem *
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the user problems you discovered *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="What problems did users tell you about? What pain points are you solving?"
                  value={formData.user_problem}
                  onChange={(e) => setFormData({...formData, user_problem: e.target.value})}
                />
              </div>
            </div>

            {/* Roles Needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What roles are you looking for? *
              </label>

              {/* Default roles */}
              <div className="flex flex-wrap gap-2 mb-4">
                {DEFAULT_ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.roles_needed.includes(role)
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Custom role input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Add custom role (e.g., Data Scientist)"
                  value={formData.custom_role}
                  onChange={(e) => setFormData({...formData, custom_role: e.target.value})}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomRole()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomRole}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  Add
                </button>
              </div>

              {/* Selected roles */}
              {formData.roles_needed.length > 0 && (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.roles_needed.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(role)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
