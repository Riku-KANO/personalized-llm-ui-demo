import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UIEvaluator, EvaluationContext } from '@/lib/ui-evaluator'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const evaluationRequestSchema = z.object({
  userPrompt: z.string(),
  generatedUI: z.object({
    components: z.array(z.any()),
    layout: z.string(),
    theme: z.object({
      colors: z.record(z.string()),
      fonts: z.record(z.string())
    }).optional()
  }),
  userPreferences: z.string().optional(),
  saveToDb: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = evaluationRequestSchema.parse(body)

    const evaluator = new UIEvaluator()
    const context: EvaluationContext = {
      userPrompt: validatedData.userPrompt,
      generatedUI: validatedData.generatedUI,
      userPreferences: validatedData.userPreferences
    }

    const result = await evaluator.evaluateUI(context)

    // 評価結果をDBに保存
    if (validatedData.saveToDb) {
      await prisma.uiEvaluation.create({
        data: {
          userId: session.user.id,
          userPrompt: validatedData.userPrompt,
          uiData: JSON.stringify(validatedData.generatedUI),
          evaluationResult: JSON.stringify(result),
          score: result.score,
          createdAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      evaluation: result
    })

  } catch (error) {
    console.error('UI evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate UI' },
      { status: 500 }
    )
  }
}

// バッチ評価用エンドポイント
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contexts } = body

    const evaluator = new UIEvaluator()
    const results = await evaluator.batchEvaluate(contexts)
    const stats = evaluator.generateStats(results)

    return NextResponse.json({
      success: true,
      results,
      statistics: stats
    })

  } catch (error) {
    console.error('Batch evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to perform batch evaluation' },
      { status: 500 }
    )
  }
}