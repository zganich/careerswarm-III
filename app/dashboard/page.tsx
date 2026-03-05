import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: userData }, { data: dna }, { data: achievements }, { data: applications }] =
    await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('career_dna').select('*').eq('user_id', user.id).single(),
      supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('included', true)
        .order('impact', { ascending: false })
        .limit(20),
      supabase
        .from('generated_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(50),
    ])

  if (!userData?.onboarding_complete || !dna) {
    redirect('/onboarding')
  }

  return (
    <Suspense>
      <DashboardClient
        user={user}
        userData={userData}
        dna={dna}
        achievements={achievements || []}
        applications={applications || []}
      />
    </Suspense>
  )
}
