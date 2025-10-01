import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ThreadHistoryClient } from '@/components/thread-history-client'

export default async function ThreadHistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return <ThreadHistoryClient />
}
