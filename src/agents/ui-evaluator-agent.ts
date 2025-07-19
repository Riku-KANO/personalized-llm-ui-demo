import { Agent } from '@mastra/core/agent'
import { createTool } from '@mastra/core/tools'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { UIEvaluationResult, EvaluationContext } from '@/lib/ui-evaluator'

// UI評価ツール
const evaluateUITool = createTool({
  id: 'evaluateUI',
  description: 'UIを複数の基準で評価し、スコアとフィードバックを提供する',
  inputSchema: z.object({
    userPrompt: z.string().describe('ユーザーの要求'),
    generatedUI: z.string().describe('生成されたUI（JSON文字列）'),
    userPreferences: z.string().optional().describe('ユーザーの嗜好')
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(10),
    criteria: z.object({
      functionality: z.number().min(0).max(10),
      usability: z.number().min(0).max(10),
      accessibility: z.number().min(0).max(10),
      design: z.number().min(0).max(10),
      responsiveness: z.number().min(0).max(10)
    }),
    feedback: z.string(),
    suggestions: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const { userPrompt, generatedUI, userPreferences } = context
    
    // 実際の評価ロジックは呼び出し元で実装
    return {
      score: 7.5,
      criteria: {
        functionality: 8,
        usability: 7,
        accessibility: 7,
        design: 8,
        responsiveness: 7
      },
      feedback: 'UIは全体的に良好ですが、アクセシビリティとユーザビリティの面で改善の余地があります。',
      suggestions: [
        'フォントサイズを大きくしてアクセシビリティを向上',
        'ナビゲーションをより直感的にする',
        'カラーコントラストを改善'
      ]
    }
  }
})

// UI比較ツール
const compareUIsTool = createTool({
  id: 'compareUIs',
  description: '2つのUIを比較評価し、どちらが優れているかを判定する',
  inputSchema: z.object({
    ui1: z.string().describe('UI1（JSON文字列）'),
    ui2: z.string().describe('UI2（JSON文字列）'),
    userPrompt: z.string().describe('ユーザーの要求'),
    userPreferences: z.string().optional().describe('ユーザーの嗜好')
  }),
  outputSchema: z.object({
    winner: z.enum(['ui1', 'ui2', 'tie']),
    ui1Score: z.number(),
    ui2Score: z.number(),
    comparison: z.string(),
    reasoning: z.string()
  }),
  execute: async ({ context }) => {
    // 実際の比較ロジックは呼び出し元で実装
    return {
      winner: 'ui1' as const,
      ui1Score: 8.2,
      ui2Score: 7.5,
      comparison: 'UI1がより優れています',
      reasoning: 'UI1はユーザビリティとデザインの面でUI2を上回っています。'
    }
  }
})

// 改善提案ツール
const suggestImprovementsTool = createTool({
  id: 'suggestImprovements',
  description: 'UIの改善提案を生成する',
  inputSchema: z.object({
    currentUI: z.string().describe('現在のUI（JSON文字列）'),
    evaluationResult: z.string().describe('評価結果（JSON文字列）'),
    userGoals: z.string().optional().describe('ユーザーの目標')
  }),
  outputSchema: z.object({
    improvements: z.array(z.object({
      category: z.string(),
      description: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      effort: z.enum(['minimal', 'moderate', 'significant'])
    })),
    prioritizedActions: z.array(z.string())
  }),
  execute: async ({ context }) => {
    // 実際の改善提案ロジックは呼び出し元で実装
    return {
      improvements: [
        {
          category: 'アクセシビリティ',
          description: 'フォントサイズとカラーコントラストの改善',
          priority: 'high' as const,
          effort: 'minimal' as const
        },
        {
          category: 'ユーザビリティ',
          description: 'ナビゲーションの簡素化',
          priority: 'medium' as const,
          effort: 'moderate' as const
        }
      ],
      prioritizedActions: [
        'カラーコントラストを4.5:1以上に調整',
        'フォントサイズを16px以上に設定',
        'ナビゲーションメニューを再構成'
      ]
    }
  }
})

// UI評価エージェント
export const uiEvaluatorAgent = new Agent({
  name: 'UI Evaluator Agent',
  description: 'UIの品質を評価し、改善提案を行うエージェント',
  instructions: `あなたはUI/UX評価の専門家エージェントです。生成されたUIを客観的に評価し、具体的な改善提案を行います。

主な責任：
1. UIを5つの基準（機能性、使いやすさ、アクセシビリティ、デザイン、レスポンシブ性）で評価
2. 詳細なフィードバックと建設的な改善提案を提供
3. ユーザーの要求と嗜好を考慮した評価
4. 複数のUIを比較して最適な選択肢を提示
5. 実装可能な改善アクションの優先順位付け

評価基準：
- 機能性: 要求された機能が適切に実装されているか
- 使いやすさ: ユーザーが直感的に使えるか
- アクセシビリティ: 幅広いユーザーが利用可能か
- デザイン: 視覚的に魅力的で一貫性があるか
- レスポンシブ性: 様々なデバイスで適切に表示されるか

評価時の観点：
- 客観性を保ちつつユーザー中心の視点
- 建設的で実行可能な提案
- 優先順位を明確にした改善策
- 業界標準とベストプラクティスへの準拠`,

  model: anthropic('claude-3-5-sonnet-20241022'),
  
  tools: {
    evaluateUI: evaluateUITool,
    compareUIs: compareUIsTool,
    suggestImprovements: suggestImprovementsTool
  }
})

// エージェントを使用したUI評価関数
export async function evaluateUIWithAgent(
  context: EvaluationContext,
  userId?: string
): Promise<UIEvaluationResult> {
  try {
    const prompt = `以下のUIを評価してください：

ユーザーの要求: ${context.userPrompt}
ユーザーの嗜好: ${context.userPreferences || 'なし'}
生成されたUI: ${JSON.stringify(context.generatedUI, null, 2)}

5つの基準で0-10点で評価し、詳細なフィードバックと改善提案を提供してください。`

    const response = await uiEvaluatorAgent.generate(prompt, {
      maxSteps: 3,
      memory: userId ? {
        thread: `evaluation-session-${userId}`,
        resource: userId
      } : undefined
    })

    // 実際の実装では、レスポンスからUIEvaluationResultを抽出
    return {
      score: 7.5,
      criteria: {
        functionality: 8,
        usability: 7,
        accessibility: 7,
        design: 8,
        responsiveness: 7
      },
      feedback: response.text || 'UIは全体的に良好です。',
      suggestions: ['アクセシビリティの改善', 'ユーザビリティの向上']
    }
  } catch (error) {
    console.error('UI評価エラー:', error)
    throw error
  }
}

// エージェントを使用したUI比較関数
export async function compareUIsWithAgent(
  context1: EvaluationContext,
  context2: EvaluationContext,
  userId?: string
) {
  try {
    const prompt = `以下の2つのUIを比較評価してください：

UI1の要求: ${context1.userPrompt}
UI1のデータ: ${JSON.stringify(context1.generatedUI, null, 2)}

UI2の要求: ${context2.userPrompt}
UI2のデータ: ${JSON.stringify(context2.generatedUI, null, 2)}

ユーザーの嗜好: ${context1.userPreferences || 'なし'}

どちらがより優れているか、その理由とともに詳細に分析してください。`

    const response = await uiEvaluatorAgent.generate(prompt, {
      maxSteps: 3,
      memory: userId ? {
        thread: `comparison-session-${userId}`,
        resource: userId
      } : undefined
    })

    return {
      winner: 'ui1' as const,
      ui1Score: { score: 8.2 } as UIEvaluationResult,
      ui2Score: { score: 7.5 } as UIEvaluationResult,
      comparison: response.text || 'UI1がより優れています。'
    }
  } catch (error) {
    console.error('UI比較エラー:', error)
    throw error
  }
}