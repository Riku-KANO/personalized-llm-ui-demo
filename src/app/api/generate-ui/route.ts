import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const UISchema = z.object({
  type: z.enum(['dashboard', 'profile', 'gallery', 'blog', 'shop']),
  title: z.string(),
  description: z.string(),
  primaryColor: z.string(),
  accentColor: z.string(),
  layout: z.enum(['vertical', 'horizontal', 'sidebar-left', 'sidebar-right', 'grid']),
  components: z.array(z.object({
    type: z.enum(['hero', 'card', 'list', 'button', 'text', 'sidebar', 'navigation', 'content-area']),
    title: z.string(),
    content: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    borderColor: z.string().optional(),
    customStyle: z.string().optional(),
    width: z.enum(['full', 'half', 'third', 'quarter', 'sidebar']).optional(),
    position: z.enum(['left', 'right', 'center', 'top', 'bottom']).optional()
  }))
})

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json()
    
    if (!preferences) {
      return NextResponse.json({ error: 'Preferences are required' }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: UISchema,
      prompt: `ユーザーの嗜好に基づいてパーソナライズされたUIを生成してください。

      ユーザーの嗜好: ${preferences}

      以下の要件に従ってUIを設計してください：
      1. ユーザーの嗜好に合ったテーマとカラースキームを選択
      2. 適切なコンポーネントタイプを選択
      3. 魅力的なコンテンツを生成
      4. 日本語でコンテンツを作成

      レイアウト設定について：
      - layout: 'vertical' (縦配置), 'horizontal' (横配置), 'sidebar-left' (左サイドバー), 'sidebar-right' (右サイドバー), 'grid' (グリッド配置)
      - コンポーネントの width: 'full' (100%), 'half' (50%), 'third' (33%), 'quarter' (25%), 'sidebar' (サイドバー幅)
      - position: 'left', 'right', 'center', 'top', 'bottom' (配置位置)

      コンポーネントタイプについて：
      - hero: メインビジュアル
      - card: カードレイアウト
      - list: リスト表示
      - button: ボタン
      - text: テキストエリア
      - sidebar: サイドバー
      - navigation: ナビゲーション
      - content-area: コンテンツエリア

      カラー設定について：
      - primaryColor, accentColor: #で始まるhexコード
      - backgroundColor: 各コンポーネントの背景色 (#hexコード)
      - textColor: テキストの色 (#hexコード)
      - borderColor: 境界線の色 (#hexコード、オプション)
      - customStyle: 追加のTailwindCSSクラス（オプション）

      例：
      - layout: "sidebar-left"
      - width: "sidebar"
      - position: "left"
      - backgroundColor: "#f3f4f6"
      - textColor: "#1f2937"
      - borderColor: "#e5e7eb"
      - customStyle: "rounded-lg shadow-md hover:shadow-lg"`,
    })

    return NextResponse.json({ ui: object })
  } catch (error) {
    console.error('UI generation error:', error)
    return NextResponse.json({ error: 'Failed to generate UI' }, { status: 500 })
  }
}