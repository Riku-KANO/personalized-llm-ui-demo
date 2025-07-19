import { Mastra } from 'mastra'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { GeneratedUI } from '@/types/ui'

export interface UIEvaluationResult {
  score: number
  criteria: {
    functionality: number
    usability: number
    accessibility: number
    design: number
    responsiveness: number
  }
  feedback: string
  suggestions: string[]
}

export interface EvaluationContext {
  userPrompt: string
  generatedUI: GeneratedUI
  userPreferences?: string
}

export class UIEvaluator {
  private mastra: Mastra

  constructor() {
    this.mastra = new Mastra({
      name: 'ui-evaluator',
      agents: [],
      workflows: [],
      tools: []
    })
  }

  async evaluateUI(context: EvaluationContext): Promise<UIEvaluationResult> {
    const { userPrompt, generatedUI, userPreferences } = context

    // AI-powered evaluation using multiple criteria
    const evaluationPrompt = this.buildEvaluationPrompt(context)
    
    const result = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: evaluationPrompt,
      temperature: 0.2
    })

    return this.parseEvaluationResult(result.text)
  }

  private buildEvaluationPrompt(context: EvaluationContext): string {
    const { userPrompt, generatedUI, userPreferences } = context

    return `
あなたはUI/UXエキスパートです。以下の生成されたUIを評価してください。

## ユーザーの要求:
${userPrompt}

## ユーザーの嗜好 (もしあれば):
${userPreferences || 'なし'}

## 生成されたUI:
${JSON.stringify(generatedUI, null, 2)}

## 評価基準:
以下の5つの観点から0-10点で評価し、JSONで回答してください:

1. **機能性 (functionality)**: 要求された機能が適切に実装されているか
2. **使いやすさ (usability)**: ユーザーが直感的に使えるか
3. **アクセシビリティ (accessibility)**: 幅広いユーザーが利用可能か
4. **デザイン (design)**: 視覚的に魅力的で一貫性があるか
5. **レスポンシブ性 (responsiveness)**: 様々なデバイスで適切に表示されるか

回答形式:
{
  "score": 総合点(0-10),
  "criteria": {
    "functionality": 点数,
    "usability": 点数,
    "accessibility": 点数,
    "design": 点数,
    "responsiveness": 点数
  },
  "feedback": "詳細なフィードバック",
  "suggestions": ["改善提案1", "改善提案2", "..."]
}
`
  }

  private parseEvaluationResult(resultText: string): UIEvaluationResult {
    try {
      // JSONパースを試行
      const parsed = JSON.parse(resultText)
      return {
        score: parsed.score || 0,
        criteria: {
          functionality: parsed.criteria?.functionality || 0,
          usability: parsed.criteria?.usability || 0,
          accessibility: parsed.criteria?.accessibility || 0,
          design: parsed.criteria?.design || 0,
          responsiveness: parsed.criteria?.responsiveness || 0
        },
        feedback: parsed.feedback || '',
        suggestions: parsed.suggestions || []
      }
    } catch (error) {
      // パースに失敗した場合のフォールバック
      return {
        score: 5,
        criteria: {
          functionality: 5,
          usability: 5,
          accessibility: 5,
          design: 5,
          responsiveness: 5
        },
        feedback: resultText,
        suggestions: []
      }
    }
  }

  // A/Bテスト用の比較評価
  async compareUIs(
    context1: EvaluationContext,
    context2: EvaluationContext
  ): Promise<{
    winner: 'ui1' | 'ui2' | 'tie'
    ui1Score: UIEvaluationResult
    ui2Score: UIEvaluationResult
    comparison: string
  }> {
    const [result1, result2] = await Promise.all([
      this.evaluateUI(context1),
      this.evaluateUI(context2)
    ])

    const comparisonPrompt = `
2つのUIを比較してください:

UI1の評価:
${JSON.stringify(result1, null, 2)}

UI2の評価:
${JSON.stringify(result2, null, 2)}

どちらがより優れているか、その理由とともに教えてください。
`

    const comparison = await generateText({
      model: openai('gpt-4o'),
      prompt: comparisonPrompt,
      temperature: 0.1
    })

    let winner: 'ui1' | 'ui2' | 'tie' = 'tie'
    if (result1.score > result2.score + 0.5) {
      winner = 'ui1'
    } else if (result2.score > result1.score + 0.5) {
      winner = 'ui2'
    }

    return {
      winner,
      ui1Score: result1,
      ui2Score: result2,
      comparison: comparison.text
    }
  }

  // バッチ評価（複数UIの一括評価）
  async batchEvaluate(contexts: EvaluationContext[]): Promise<UIEvaluationResult[]> {
    return Promise.all(contexts.map(context => this.evaluateUI(context)))
  }

  // 評価結果の統計分析
  generateStats(results: UIEvaluationResult[]) {
    const scores = results.map(r => r.score)
    const criteriaAvgs = {
      functionality: results.reduce((sum, r) => sum + r.criteria.functionality, 0) / results.length,
      usability: results.reduce((sum, r) => sum + r.criteria.usability, 0) / results.length,
      accessibility: results.reduce((sum, r) => sum + r.criteria.accessibility, 0) / results.length,
      design: results.reduce((sum, r) => sum + r.criteria.design, 0) / results.length,
      responsiveness: results.reduce((sum, r) => sum + r.criteria.responsiveness, 0) / results.length
    }

    return {
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      criteriaAverages: criteriaAvgs,
      totalEvaluations: results.length
    }
  }
}