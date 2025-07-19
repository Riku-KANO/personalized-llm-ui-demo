import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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
  type: z.enum(['dashboard', 'profile', 'gallery', 'blog', 'shop', 'complex']),
  title: z.string(),
  description: z.string(),
  primaryColor: z.string(),
  accentColor: z.string(),
  layout: z.enum(['vertical', 'horizontal', 'sidebar-left', 'sidebar-right', 'grid', 'complex']),
  components: z.array(UIComponentSchema)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user's current UI and preferences
    const [currentUI, userPreferences] = await Promise.all([
      prisma.userUI.findFirst({
        where: {
          userId: session.user.id,
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.userPreference.findFirst({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    const currentUIData = currentUI ? JSON.parse(currentUI.uiData) : null
    const preferences = userPreferences?.preferences || ''

    // Generate AI response
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: UISchema,
      prompt: `あなたはUI生成アシスタントです。ユーザーの要求に基づいてUIを生成または修正してください。

ユーザーの嗜好: ${preferences}

現在のUI: ${currentUIData ? JSON.stringify(currentUIData) : 'なし'}

ユーザーの要求: ${message}

以下の指示に従ってUIを生成してください：
1. ユーザーの嗜好を考慮する
2. 現在のUIがある場合は、それを基に修正する
3. 新しいUIを作成する場合は、ユーザーの要求に合わせて設計する
4. 日本語でコンテンツを作成する
5. 適切な階層構造を使用する（childrenを活用）

レイアウト設定について：
- layout: 'vertical' (縦配置), 'horizontal' (横配置), 'sidebar-left' (左サイドバー), 'sidebar-right' (右サイドバー), 'grid' (グリッド配置), 'complex' (複雑な階層構造)
- コンポーネントの width: 'full' (100%), 'half' (50%), 'third' (33%), 'quarter' (25%), 'sidebar' (サイドバー幅), 'auto' (自動), 'fit' (内容に合わせて)
- height: 'auto' (自動), 'screen' (画面高さ), 'full' (100%), 'fit' (内容に合わせて)
- position: 'absolute', 'relative', 'fixed', 'sticky', 'left', 'right', 'center', 'top', 'bottom'

コンポーネントタイプについて：
- hero: メインビジュアル
- card: カードレイアウト
- list: リスト表示
- button: ボタン
- text: テキストエリア
- sidebar: サイドバー（固定幅推奨）
- navigation: ナビゲーション
- content-area: メインコンテンツエリア（flex-1推奨）
- container: 汎用コンテナ（子要素を持つ）
- section: セクション要素（子要素を持つ）
- header: ヘッダー要素（位置固定可能）
- footer: フッター要素（位置固定可能）
- flex: フレックスボックスレイアウト（flexDirection, alignItems, justifyContent設定可能）
- grid: グリッドレイアウト（gridCols, gridRows設定可能）

複雑なレイアウトの例：
1. ヘッダー + サイドバー + メインコンテンツ:
   - layout: 'complex'
   - ヘッダー: position='sticky', top=0, width='full', zIndex=10
   - flexコンテナ: flexDirection='row', height='screen'
     - サイドバー: width='sidebar', height='full'
     - content-area: width='full', padding='md'

2. グリッドレイアウト:
   - gridコンポーネント: gridCols=3, gap='md'
   - 子要素としてcardコンポーネントを配置

親子関係について：
- childrenプロパティを使用して階層構造を表現
- コンテナ系コンポーネント（container, section, flex, grid, header, footer）は子要素を持つことができる
- 子要素は親要素のレイアウトルールに従う

カラー設定について：
- primaryColor, accentColor: #で始まるhexコード
- backgroundColor: 各コンポーネントの背景色 (#hexコード)
- textColor: テキストの色 (#hexコード)
- borderColor: 境界線の色 (#hexコード、オプション)
- customStyle: 追加のTailwindCSSクラス（オプション）`,
    })

    // Save the conversation
    await prisma.conversation.create({
      data: {
        userId: session.user.id,
        message,
        response: JSON.stringify(object)
      }
    })

    // Save the new UI
    await prisma.userUI.updateMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    await prisma.userUI.create({
      data: {
        userId: session.user.id,
        uiData: JSON.stringify(object),
        isActive: true
      }
    })

    return NextResponse.json({ 
      response: 'UIを更新しました！',
      ui: object 
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}