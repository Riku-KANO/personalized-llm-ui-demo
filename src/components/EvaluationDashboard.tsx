'use client'

import { useState, useEffect } from 'react'
import { UIEvaluationResult } from '@/lib/ui-evaluator'

interface EvaluationHistory {
  id: string
  userPrompt: string
  score: number
  createdAt: string
  evaluationResult: UIEvaluationResult
}

export default function EvaluationDashboard() {
  const [evaluations, setEvaluations] = useState<EvaluationHistory[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvaluationHistory()
  }, [])

  const fetchEvaluationHistory = async () => {
    try {
      const response = await fetch('/api/evaluations/history')
      const data = await response.json()
      setEvaluations(data.evaluations)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch evaluation history:', error)
    } finally {
      setLoading(false)
    }
  }

  const ScoreBar = ({ score, max = 10 }: { score: number, max?: number }) => {
    const percentage = (score / max) * 100
    const getColor = (score: number) => {
      if (score >= 8) return 'bg-green-500'
      if (score >= 6) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor(score)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  const CriteriaRadar = ({ criteria }: { criteria: UIEvaluationResult['criteria'] }) => {
    const criteriaNames = {
      functionality: '機能性',
      usability: '使いやすさ',
      accessibility: 'アクセシビリティ',
      design: 'デザイン',
      responsiveness: 'レスポンシブ'
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(criteria).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {criteriaNames[key as keyof typeof criteriaNames]}
            </div>
            <div className="text-2xl font-bold text-blue-600">{value.toFixed(1)}</div>
            <ScoreBar score={value} />
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      {stats && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">評価統計</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalEvaluations}</div>
              <div className="text-sm text-gray-600">総評価数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.averageScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">平均スコア</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.maxScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">最高スコア</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.minScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">最低スコア</div>
            </div>
          </div>
        </div>
      )}

      {/* 基準別平均 */}
      {stats && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">基準別平均スコア</h2>
          <CriteriaRadar criteria={stats.criteriaAverages} />
        </div>
      )}

      {/* 評価履歴 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">評価履歴</h2>
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">
                    {new Date(evaluation.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="font-medium text-gray-800 mb-2">
                    {evaluation.userPrompt}
                  </div>
                  <div className="text-sm text-gray-600">
                    総合スコア: <span className="font-semibold">{evaluation.score.toFixed(1)}/10</span>
                  </div>
                </div>
                <div className="ml-4">
                  <ScoreBar score={evaluation.score} />
                </div>
              </div>
              
              {/* 詳細評価 */}
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  詳細を表示
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <CriteriaRadar criteria={evaluation.evaluationResult.criteria} />
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">フィードバック:</div>
                    <div className="text-sm text-gray-600 mb-3">
                      {evaluation.evaluationResult.feedback}
                    </div>
                    {evaluation.evaluationResult.suggestions.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">改善提案:</div>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {evaluation.evaluationResult.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}