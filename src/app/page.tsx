'use client'

import { useState } from 'react'
import PreferencesForm from '@/components/PreferencesForm'
import DynamicUI from '@/components/DynamicUI'

interface GeneratedUI {
  type: 'dashboard' | 'profile' | 'gallery' | 'blog' | 'shop'
  title: string
  description: string
  primaryColor: string
  accentColor: string
  layout: 'vertical' | 'horizontal' | 'sidebar-left' | 'sidebar-right' | 'grid'
  components: Array<{
    type: 'hero' | 'card' | 'list' | 'button' | 'text' | 'sidebar' | 'navigation' | 'content-area'
    title: string
    content: string
    backgroundColor: string
    textColor: string
    borderColor?: string
    customStyle?: string
    width?: 'full' | 'half' | 'third' | 'quarter' | 'sidebar'
    position?: 'left' | 'right' | 'center' | 'top' | 'bottom'
  }>
}

export default function Home() {
  const [generatedUI, setGeneratedUI] = useState<GeneratedUI | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (preferences: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-ui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      })

      if (!response.ok) {
        throw new Error('UIの生成に失敗しました')
      }

      const data = await response.json()
      setGeneratedUI(data.ui)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setGeneratedUI(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            パーソナライズされたUI生成
          </h1>
          <p className="text-gray-600">
            あなたの嗜好に基づいてLLMが動的にUIを生成します
          </p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {!generatedUI ? (
          <PreferencesForm onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                新しいUIを生成
              </button>
            </div>
            <DynamicUI ui={generatedUI} />
          </div>
        )}
      </div>
    </div>
  )
}
