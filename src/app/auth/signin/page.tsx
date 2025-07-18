import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AuthButton from '@/components/AuthButton'

export default async function SignIn() {
  const session = await getServerSession(authOptions)
  
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            パーソナライズされたUIアプリ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ログインして、あなただけのUIを作成しましょう
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  )
}