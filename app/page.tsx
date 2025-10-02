import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ProjectBoard from '@/components/ProjectBoard'

export default async function Home() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      profiles (
        full_name,
        email,
        twitter,
        linkedin
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <ProjectBoard initialProjects={projects || []} />
    </>
  )
}
