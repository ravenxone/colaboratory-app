import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get collaboration requests for user's projects
  const projectIds = projects?.map(p => p.id) || []
  const { data: collaborationRequests } = await supabase
    .from('collaboration_requests')
    .select(`
      *,
      projects (
        title,
        id
      )
    `)
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <Dashboard
        projects={projects || []}
        collaborationRequests={collaborationRequests || []}
      />
    </>
  )
}
