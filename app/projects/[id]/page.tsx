import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ProjectDetail from '@/components/ProjectDetail'
import { notFound } from 'next/navigation'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      profiles (
        full_name,
        email,
        twitter,
        linkedin,
        phone
      )
    `)
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar />
      <ProjectDetail project={project} currentUser={user} />
    </>
  )
}
