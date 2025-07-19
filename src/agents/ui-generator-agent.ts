import { Agent } from '@mastra/core/agent'
import { createTool } from '@mastra/core/tools'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { UISchema, UIComponentSchema } from '@/types/ui'
import { prisma } from '@/lib/prisma'

// UI生成用のツール
const generateUITool = createTool({
  id: 'generateUI',
  description: 'ユーザーの嗜好に基づいてUIを生成する',
  inputSchema: z.object({
    preferences: z.string().describe('ユーザーの嗜好'),
    currentUI: z.string().optional().describe('現在のUI（JSON文字列）'),
    userMessage: z.string().optional().describe('ユーザーからの要求メッセージ')
  }),
  outputSchema: UISchema,
  execute: async ({ context }) => {
    const { preferences, currentUI, userMessage } = context
    
    // ここでAI生成ロジックを実装
    // 実際のAI生成は呼び出し元で行う想定
    return {
      type: 'complex' as const,
      title: 'Generated UI',
      description: 'AI Generated UI based on preferences',
      primaryColor: '#3b82f6',
      accentColor: '#10b981',
      layout: 'complex' as const,
      components: []
    }
  }
})

// ユーザー設定取得ツール
const getUserDataTool = createTool({
  id: 'getUserData',
  description: 'ユーザーの現在のUIと嗜好を取得する',
  inputSchema: z.object({
    userId: z.string().describe('ユーザーID')
  }),
  outputSchema: z.object({
    currentUI: z.string().nullable(),
    preferences: z.string().nullable()
  }),
  execute: async ({ context }) => {
    const { userId } = context
    
    const [currentUI, userPreferences] = await Promise.all([
      prisma.userUI.findFirst({
        where: {
          userId,
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.userPreference.findFirst({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    return {
      currentUI: currentUI?.uiData || null,
      preferences: userPreferences?.preferences || null
    }
  }
})

// UI保存ツール
const saveUITool = createTool({
  id: 'saveUI',
  description: '生成されたUIをデータベースに保存する',
  inputSchema: z.object({
    userId: z.string().describe('ユーザーID'),
    uiData: z.string().describe('UI データ（JSON文字列）'),
    message: z.string().optional().describe('ユーザーメッセージ'),
    response: z.string().optional().describe('エージェントの応答')
  }),
  outputSchema: z.object({
    success: z.boolean(),
    uiId: z.string().optional()
  }),
  execute: async ({ context }) => {
    const { userId, uiData, message, response } = context
    
    try {
      // 既存のアクティブUIを無効化
      await prisma.userUI.updateMany({
        where: {
          userId,
          isActive: true
        },
        data: {
          isActive: false
        }
      })

      // 新しいUIを保存
      const newUI = await prisma.userUI.create({
        data: {
          userId,
          uiData,
          isActive: true
        }
      })

      // 会話履歴を保存（メッセージがある場合）
      if (message && response) {
        await prisma.conversation.create({
          data: {
            userId,
            message,
            response
          }
        })
      }

      return {
        success: true,
        uiId: newUI.id
      }
    } catch (error) {
      console.error('UI保存エラー:', error)
      return {
        success: false
      }
    }
  }
})

// UI生成エージェント
export const uiGeneratorAgent = new Agent({
  name: 'UI Generator Agent',
  description: 'ユーザーの嗜好に基づいてパーソナライズされたUIを生成するエージェント',
  instructions: `あなたはUI/UXエキスパートのエージェントです。ユーザーの嗜好や要求に基づいて、美しく機能的なUIを生成します。

主な責任：
1. ユーザーの嗜好を理解し、それに基づいたUIデザインを提案
2. 既存のUIがある場合は、それを考慮した修正・改善を行う
3. アクセシビリティとユーザビリティを重視したデザイン
4. 日本語でのコミュニケーション
5. 適切な階層構造とレイアウトの設計

UI生成時の指針：
- ユーザーの嗜好を最優先に考慮
- 直感的で使いやすいインターフェース
- 視覚的に魅力的なデザイン
- レスポンシブ対応
- アクセシビリティの確保

利用可能なツール：
- generateUI: UI生成
- getUserData: ユーザーデータ取得
- saveUI: UI保存`,

  model: openai('gpt-4o'),
  
  tools: {
    generateUI: generateUITool,
    getUserData: getUserDataTool,
    saveUI: saveUITool
  }
})

// エージェントを使用したUI生成関数
export async function generateUIWithAgent(
  userId: string,
  preferences?: string,
  userMessage?: string
) {
  try {
    const prompt = userMessage 
      ? `ユーザーからの要求: ${userMessage}\n嗜好: ${preferences || 'なし'}`
      : `ユーザーの嗜好に基づいてUIを生成してください: ${preferences || 'デフォルト'}`

    const response = await uiGeneratorAgent.generate(prompt, {
      maxSteps: 5,
      memory: {
        thread: `ui-session-${userId}`,
        resource: userId
      }
    })

    return response
  } catch (error) {
    console.error('UI生成エラー:', error)
    throw error
  }
}

// チャット形式でのUI生成
export async function chatWithUIAgent(
  userId: string,
  message: string
) {
  try {
    const response = await uiGeneratorAgent.generate(message, {
      maxSteps: 5,
      memory: {
        thread: `chat-session-${userId}`,
        resource: userId
      }
    })

    return response
  } catch (error) {
    console.error('チャットエラー:', error)
    throw error
  }
}