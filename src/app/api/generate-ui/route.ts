import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const UIComponentSchema = z.object({
  id: z.string(),
  type: z.enum(['hero', 'card', 'list', 'button', 'text', 'sidebar', 'navigation', 'content-area', 'container', 'section', 'header', 'footer', 'flex', 'grid']),
  title: z.string(),
  content: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  borderColor: z.string().optional(),
  customStyle: z.string().optional(),
  width: z.enum(['full', 'half', 'third', 'quarter', 'sidebar', 'auto', 'fit']).optional(),
  height: z.enum(['auto', 'screen', 'full', 'fit']).optional(),
  position: z.enum(['left', 'right', 'center', 'top', 'bottom', 'absolute', 'relative', 'fixed', 'sticky']).optional(),
  flexDirection: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).optional(),
  alignItems: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).optional(),
  justifyContent: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).optional(),
  gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional(),
  padding: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional(),
  margin: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional(),
  gridCols: z.number().int().min(1).max(12).optional(),
  gridRows: z.number().int().min(1).max(6).optional(),
  order: z.number().int().optional(),
  zIndex: z.number().int().optional(),
  children: z.array(z.lazy(() => UIComponentSchema)).optional()
})

const UISchema = z.object({
  type: z.enum(['dashboard', 'profile', 'gallery', 'blog', 'shop']),
  title: z.string(),
  description: z.string(),
  primaryColor: z.string(),
  accentColor: z.string(),
  layout: z.enum(['vertical', 'horizontal', 'sidebar-left', 'sidebar-right', 'grid', 'complex']),
  components: z.array(UIComponentSchema)
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
      2. 適切なコンポーネントタイプを選択し、階層構造を活用
      3. 魅力的なコンテンツを生成
      4. 日本語でコンテンツを作成
      5. 各コンポーネントにユニークなidを付与

      レイアウト設定について：
      - layout: 'vertical' (縦配置), 'horizontal' (横配置), 'sidebar-left' (左サイドバー), 'sidebar-right' (右サイドバー), 'grid' (グリッド配置), 'complex' (複雑な階層構造)
      - コンポーネントの width: 'full' (100%), 'half' (50%), 'third' (33%), 'quarter' (25%), 'sidebar' (サイドバー幅), 'auto' (自動), 'fit' (内容に合わせて)
      - height: 'auto' (自動), 'screen' (画面高さ), 'full' (100%), 'fit' (内容に合わせて)
      - position: 'left', 'right', 'center', 'top', 'bottom' (配置位置) または 'absolute', 'relative', 'fixed', 'sticky' (CSS position)

      コンポーネントタイプについて：
      - hero: メインビジュアル
      - card: カードレイアウト
      - list: リスト表示
      - button: ボタン
      - text: テキストエリア
      - sidebar: サイドバー
      - navigation: ナビゲーション
      - content-area: コンテンツエリア
      - container: 汎用コンテナ（子要素を持つ）
      - section: セクション要素
      - header: ヘッダー要素
      - footer: フッター要素
      - flex: フレックスボックスレイアウト
      - grid: グリッドレイアウト

      新しいレイアウトプロパティ（layout: 'complex'の場合に使用）：
      - flexDirection: 'row', 'column', 'row-reverse', 'column-reverse'
      - alignItems: 'start', 'center', 'end', 'stretch', 'baseline'
      - justifyContent: 'start', 'center', 'end', 'between', 'around', 'evenly'
      - gap: 'none', 'xs', 'sm', 'md', 'lg', 'xl'
      - padding: 'none', 'xs', 'sm', 'md', 'lg', 'xl'
      - margin: 'none', 'xs', 'sm', 'md', 'lg', 'xl'
      - gridCols: 1〜12 (グリッドの列数)
      - gridRows: 1〜6 (グリッドの行数)
      - order: 数値 (フレックスボックスの順序)
      - zIndex: 数値 (z-indexの値)

      親子関係について：
      - childrenプロパティを使用して階層構造を表現
      - containerやsectionなどのコンテナコンポーネントは子要素を持つことができる
      - flexやgridコンポーネントは子要素のレイアウトを制御

      カラー設定について：
      - primaryColor, accentColor: #で始まるhexコード
      - backgroundColor: 各コンポーネントの背景色 (#hexコード)
      - textColor: テキストの色 (#hexコード)
      - borderColor: 境界線の色 (#hexコード、オプション)
      - customStyle: 追加のTailwindCSSクラス（オプション）

      例（複雑なレイアウト）：
      layout: "complex"
      components: [
        {
          id: "header-1",
          type: "header",
          title: "ヘッダー",
          content: "メインヘッダー",
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          width: "full",
          padding: "md",
          children: [
            {
              id: "nav-1",
              type: "navigation",
              title: "ナビゲーション",
              content: "ホーム\\nサービス\\nお問い合わせ",
              backgroundColor: "transparent",
              textColor: "#ffffff"
            }
          ]
        },
        {
          id: "main-flex-1",
          type: "flex",
          title: "",
          content: "",
          backgroundColor: "#f9fafb",
          textColor: "#1f2937",
          width: "full",
          flexDirection: "row",
          gap: "lg",
          padding: "lg",
          children: [
            {
              id: "sidebar-1",
              type: "sidebar",
              title: "サイドバー",
              content: "メニュー1\\nメニュー2\\nメニュー3",
              backgroundColor: "#e5e7eb",
              textColor: "#1f2937",
              width: "sidebar"
            },
            {
              id: "content-1",
              type: "content-area",
              title: "メインコンテンツ",
              content: "ここにメインコンテンツが表示されます。",
              backgroundColor: "#ffffff",
              textColor: "#1f2937",
              width: "full",
              padding: "lg"
            }
          ]
        }
      ]`,
    })

    return NextResponse.json({ ui: object })
  } catch (error) {
    console.error('UI generation error:', error)
    return NextResponse.json({ error: 'Failed to generate UI' }, { status: 500 })
  }
}