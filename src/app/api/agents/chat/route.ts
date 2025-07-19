import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { chatWithUIAgent } from '@/agents/ui-generator-agent'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 })
    }

    // エージェントベースのチャット
    const result = await chatWithUIAgent(session.user.id, message)

    return NextResponse.json({ 
      success: true,
      response: result.text || 'UIを更新しました！',
      agent: 'ui-generator'
    })
  } catch (error) {
    console.error('Agent chat error:', error)
    return NextResponse.json({ 
      error: 'Failed to process chat with agent' 
    }, { status: 500 })
  }
}