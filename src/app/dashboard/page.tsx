import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { GeneratedUI } from '@/types/ui'
import AuthButton from '@/components/AuthButton'
import DashboardSkeleton from '@/components/DashboardSkeleton'
import DashboardClient from '@/components/DashboardClient'

async function DashboardContent({ userId }: { userId: string }) {
  // Get user's active UI
  const userUI = await prisma.userUI.findFirst({
    where: {
      userId: userId,
      isActive: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Get user's preferences
  const userPreferences = await prisma.userPreference.findFirst({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  let parsedUI: GeneratedUI | null = null
  if (userUI) {
    try {
      parsedUI = JSON.parse(userUI.uiData) as GeneratedUI
    } catch (error) {
      console.error('Failed to parse UI data:', error)
    }
  }

  return (
    <DashboardClient 
      userId={userId}
      initialUI={parsedUI}
      userPreferences={userPreferences?.preferences || null}
    />
  )
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              パーソナライズされたダッシュボード
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.name || session.user.email}
              </span>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  )
}