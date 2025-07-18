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

    const userUI = await prisma.userUI.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!userUI) {
      return NextResponse.json({ ui: null })
    }

    const parsedUI = JSON.parse(userUI.uiData)
    return NextResponse.json({ ui: parsedUI })
  } catch (error) {
    console.error('Error fetching user UI:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ui } = await request.json()
    
    if (!ui) {
      return NextResponse.json({ error: 'UI data is required' }, { status: 400 })
    }

    // Deactivate existing UIs
    await prisma.userUI.updateMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    // Create new active UI
    const newUI = await prisma.userUI.create({
      data: {
        userId: session.user.id,
        uiData: JSON.stringify(ui),
        isActive: true
      }
    })

    return NextResponse.json({ success: true, id: newUI.id })
  } catch (error) {
    console.error('Error saving user UI:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}