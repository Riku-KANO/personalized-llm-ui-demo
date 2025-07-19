import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateUIWithAgent } from '@/agents/ui-generator-agent'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { preferences, userMessage } = await request.json()
    
    if (!preferences && !userMessage) {
      return NextResponse.json({ 
        error: 'Preferences or user message is required' 
      }, { status: 400 })
    }

    // エージェントベースのUI生成
    const result = await generateUIWithAgent(
      session.user.id,
      preferences,
      userMessage
    )

    return NextResponse.json({ 
      success: true,
      result: result.text,
      agent: 'ui-generator'
    })
  } catch (error) {
    console.error('Agent UI generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate UI with agent' 
    }, { status: 500 })
  }
}