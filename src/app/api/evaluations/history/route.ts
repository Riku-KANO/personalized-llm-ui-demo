import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UIEvaluationResult } from '@/lib/ui-evaluator'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ユーザーの評価履歴を取得
    const evaluations = await prisma.uiEvaluation.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // 最新50件まで
    })

    // 統計計算
    const scores = evaluations.map(e => e.score)
    const evaluationResults = evaluations.map(e => {
      try {
        return JSON.parse(e.evaluationResult) as UIEvaluationResult
      } catch {
        return null
      }
    }).filter(Boolean) as UIEvaluationResult[]

    const stats = {
      totalEvaluations: evaluations.length,
      averageScore: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0,
      minScore: scores.length > 0 ? Math.min(...scores) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
      criteriaAverages: evaluationResults.length > 0 ? {
        functionality: evaluationResults.reduce((sum, r) => sum + r.criteria.functionality, 0) / evaluationResults.length,
        usability: evaluationResults.reduce((sum, r) => sum + r.criteria.usability, 0) / evaluationResults.length,
        accessibility: evaluationResults.reduce((sum, r) => sum + r.criteria.accessibility, 0) / evaluationResults.length,
        design: evaluationResults.reduce((sum, r) => sum + r.criteria.design, 0) / evaluationResults.length,
        responsiveness: evaluationResults.reduce((sum, r) => sum + r.criteria.responsiveness, 0) / evaluationResults.length
      } : {
        functionality: 0,
        usability: 0,
        accessibility: 0,
        design: 0,
        responsiveness: 0
      }
    }

    // レスポンス用にデータを整形
    const formattedEvaluations = evaluations.map(evaluation => ({
      id: evaluation.id,
      userPrompt: evaluation.userPrompt,
      score: evaluation.score,
      createdAt: evaluation.createdAt.toISOString(),
      evaluationResult: (() => {
        try {
          return JSON.parse(evaluation.evaluationResult)
        } catch {
          return {
            score: evaluation.score,
            criteria: { functionality: 0, usability: 0, accessibility: 0, design: 0, responsiveness: 0 },
            feedback: 'データの解析に失敗しました',
            suggestions: []
          }
        }
      })()
    }))

    return NextResponse.json({
      success: true,
      evaluations: formattedEvaluations,
      stats
    })

  } catch (error) {
    console.error('Failed to fetch evaluation history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch evaluation history' },
      { status: 500 }
    )
  }
}