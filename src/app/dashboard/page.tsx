import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DynamicUI from '@/components/DynamicUI'
import { GeneratedUI } from '@/types/ui'
import AuthButton from '@/components/AuthButton'
import ChatInterface from '@/components/ChatInterface'
import DashboardSkeleton from '@/components/DashboardSkeleton'

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {parsedUI ? (
          <DynamicUI ui={parsedUI} />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              まだUIが生成されていません
            </h2>
            <p className="text-gray-600 mb-6">
              右側のチャットでUIを生成してください
            </p>
            {userPreferences && (
              <div className="text-sm text-gray-500">
                <p>保存されている嗜好:</p>
                <p className="italic">{userPreferences.preferences}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="lg:col-span-1">
        <ChatInterface userId={userId} />
      </div>
    </div>
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