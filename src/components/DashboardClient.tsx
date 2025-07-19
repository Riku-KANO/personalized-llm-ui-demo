'use client'

import { useState, useEffect } from 'react'
import DynamicUI from '@/components/DynamicUI'
import { GeneratedUI } from '@/types/ui'
import ChatInterface from '@/components/ChatInterface'

interface DashboardClientProps {
  userId: string
  initialUI: GeneratedUI | null
  userPreferences: string | null
}

export default function DashboardClient({ 
  userId, 
  initialUI, 
  userPreferences 
}: DashboardClientProps) {
  const [currentUI, setCurrentUI] = useState<GeneratedUI | null>(initialUI)
  const [showChat, setShowChat] = useState(true)

  const handleUIUpdate = (newUI: GeneratedUI) => {
    console.log('UI更新を受信:', newUI)
    setCurrentUI(newUI)
  }

  // チャットボタンのスタイル
  const chatButtonStyle = showChat ? 'right-0' : 'right-4'

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* メインUI表示エリア */}
      <div className={`transition-all duration-300 ${showChat ? 'mr-0 lg:mr-96' : 'mr-0'}`}>
        {currentUI ? (
          <DynamicUI ui={currentUI} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                まだUIが生成されていません
              </h2>
              <p className="text-gray-600 mb-6">
                右側のチャットでUIを生成してください
              </p>
              {userPreferences && (
                <div className="text-sm text-gray-500">
                  <p>保存されている嗜好:</p>
                  <p className="italic mt-2">{userPreferences}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* チャットインターフェース（サイドパネル） */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-transform duration-300 z-50 ${
        showChat ? 'translate-x-0' : 'translate-x-full'
      } w-full lg:w-96`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">UI生成チャット</h3>
          <button
            onClick={() => setShowChat(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-full pb-16 overflow-hidden">
          <ChatInterface 
            userId={userId} 
            onUIUpdate={handleUIUpdate}
          />
        </div>
      </div>

      {/* チャット表示ボタン */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className={`fixed bottom-8 ${chatButtonStyle} bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-40`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  )
}