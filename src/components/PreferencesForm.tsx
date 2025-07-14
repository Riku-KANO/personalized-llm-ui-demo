'use client'

import { useState } from 'react'

interface PreferencesFormProps {
  onGenerate: (preferences: string) => void
  isLoading: boolean
}

export default function PreferencesForm({ onGenerate, isLoading }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (preferences.trim()) {
      onGenerate(preferences)
    }
  }

  const examplePreferences = [
    'モダンでミニマルなデザインが好み、青系の色を使用',
    '温かみのあるアースカラーを使った自然なデザイン',
    'ダークモードでサイバーパンクなイメージ',
    'パステルカラーで可愛らしい雰囲気',
    'プロフェッショナルでビジネス向けのデザイン'
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        あなたの嗜好を教えてください
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-2">
            デザインの好み、色の傾向、スタイルなど
          </label>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="例: モダンでミニマルなデザインが好み、青系の色を使用したい"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">例:</p>
          <div className="flex flex-wrap gap-2">
            {examplePreferences.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPreferences(example)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!preferences.trim() || isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'UI生成中...' : 'パーソナライズされたUIを生成'}
        </button>
      </form>
    </div>
  )
}