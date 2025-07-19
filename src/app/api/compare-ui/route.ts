import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UIEvaluator, EvaluationContext } from '@/lib/ui-evaluator'
import { z } from 'zod'

const comparisonRequestSchema = z.object({
  ui1: z.object({
    userPrompt: z.string(),
    generatedUI: z.any(),
    userPreferences: z.string().optional()
  }),
  ui2: z.object({
    userPrompt: z.string(),
    generatedUI: z.any(),
    userPreferences: z.string().optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = comparisonRequestSchema.parse(body)

    const evaluator = new UIEvaluator()
    
    const context1: EvaluationContext = {
      userPrompt: validatedData.ui1.userPrompt,
      generatedUI: validatedData.ui1.generatedUI,
      userPreferences: validatedData.ui1.userPreferences
    }

    const context2: EvaluationContext = {
      userPrompt: validatedData.ui2.userPrompt,
      generatedUI: validatedData.ui2.generatedUI,
      userPreferences: validatedData.ui2.userPreferences
    }

    const comparison = await evaluator.compareUIs(context1, context2)

    return NextResponse.json({
      success: true,
      comparison
    })

  } catch (error) {
    console.error('UI comparison error:', error)
    return NextResponse.json(
      { error: 'Failed to compare UIs' },
      { status: 500 }
    )
  }
}