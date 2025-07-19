import { NextRequest, NextResponse } from 'next/server'
import { systemHealthCheck, agentHelpers } from '@/agents'

export async function GET(request: NextRequest) {
  try {
    // システムヘルスチェック
    const healthStatus = await systemHealthCheck()
    
    // 個別エージェントの詳細情報
    const agentDetails = await Promise.all(
      agentHelpers.getAllAgents().map(async (agentName) => {
        const status = await agentHelpers.checkAgentStatus(agentName)
        const agent = agentHelpers.getAgent(agentName)
        
        return {
          name: agentName,
          displayName: agent.name,
          available: status.available,
          type: status.type,
          capabilities: getAgentCapabilities(agentName)
        }
      })
    )

    return NextResponse.json({
      status: 'success',
      system: healthStatus,
      agents: agentDetails,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Agent status check error:', error)
    return NextResponse.json({ 
      status: 'error',
      error: 'Failed to check agent status',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function getAgentCapabilities(agentName: string): string[] {
  switch (agentName) {
    case 'uiGenerator':
      return [
        'UI生成',
        'ユーザー嗜好の解釈',
        'レスポンシブデザイン',
        'コンポーネント構造設計'
      ]
    case 'uiEvaluator':
      return [
        'UI品質評価',
        'アクセシビリティチェック',
        'ユーザビリティ分析',
        'UI比較・改善提案'
      ]
    case 'coordinator':
      return [
        'マルチエージェント協調',
        'ワークフロー管理',
        'タスク分散',
        '品質管理'
      ]
    default:
      return []
  }
}