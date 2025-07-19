import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get conversation history
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 50 // 最新50件
    })

    // Format for chat interface
    const messages = conversations.flatMap(conv => [
      {
        id: `user-${conv.id}`,
        content: conv.message,
        isUser: true,
        timestamp: conv.createdAt
      },
      {
        id: `ai-${conv.id}`,
        content: 'UIを更新しました！',
        isUser: false,
        timestamp: conv.createdAt
      }
    ])

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Chat history error:', error)
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 })
  }
}