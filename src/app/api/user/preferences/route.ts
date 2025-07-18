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

    const userPreferences = await prisma.userPreference.findFirst({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ preferences: userPreferences?.preferences || null })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { preferences } = await request.json()
    
    if (!preferences) {
      return NextResponse.json({ error: 'Preferences are required' }, { status: 400 })
    }

    const newPreferences = await prisma.userPreference.create({
      data: {
        userId: session.user.id,
        preferences
      }
    })

    return NextResponse.json({ success: true, id: newPreferences.id })
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}