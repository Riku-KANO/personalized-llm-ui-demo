import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    // 認証済みユーザーはダッシュボードへ
    redirect('/dashboard')
  } else {
    // 未認証ユーザーはサインインページへ
    redirect('/auth/signin')
  }
}