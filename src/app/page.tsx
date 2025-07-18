import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AuthButton from '@/components/AuthButton'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            パーソナライズされたUI生成
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            あなたの嗜好に基づいてLLMが動的にUIを生成します
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                開始するにはログインしてください
              </p>
              <AuthButton />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                機能
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AIとの対話でUIを生成・修正</li>
                <li>• ユーザー固有のUIを保存</li>
                <li>• リアルタイムでのUI更新</li>
                <li>• パーソナライズされたダッシュボード</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
