import { uiGeneratorAgent } from './ui-generator-agent'
import { uiEvaluatorAgent } from './ui-evaluator-agent'

// coordinatorAgentは循環インポートを避けるため遅延読み込み
let _coordinatorAgent: any = null
const getCoordinatorAgent = async () => {
  if (!_coordinatorAgent) {
    const { coordinatorAgent } = await import('./multi-agent-system')
    _coordinatorAgent = coordinatorAgent
  }
  return _coordinatorAgent
}

// エージェント管理システム
export const agentRegistry = {
  uiGenerator: uiGeneratorAgent,
  uiEvaluator: uiEvaluatorAgent,
  get coordinator() {
    // 同期的なアクセスには警告を表示
    console.warn('coordinatorAgentは非同期で読み込んでください')
    return null
  }
} as const

export type AgentName = keyof typeof agentRegistry

// エージェントのエクスポート
export { uiGeneratorAgent, uiEvaluatorAgent }
export { getCoordinatorAgent }

// エージェント操作用のヘルパー関数
export const agentHelpers = {
  // エージェントの取得
  getAgent: (name: AgentName) => agentRegistry[name],
  
  // 全エージェントのリスト取得
  getAllAgents: () => Object.keys(agentRegistry) as AgentName[],
  
  // エージェントの状態確認
  checkAgentStatus: async (agentName: AgentName) => {
    try {
      const agent = agentRegistry[agentName]
      return {
        name: agentName,
        available: !!agent,
        type: agent?.name || 'unknown'
      }
    } catch (error) {
      return {
        name: agentName,
        available: false,
        error: (error as Error).message
      }
    }
  }
}

// システム全体の初期化
export async function initializeAgentSystem() {
  try {
    console.log('エージェントシステムを初期化中...')
    
    // エージェントの状態確認
    const agents = agentHelpers.getAllAgents()
    const statuses = await Promise.all(
      agents.map(name => agentHelpers.checkAgentStatus(name))
    )
    
    statuses.forEach(status => {
      console.log(`${status.name}:`, status.available ? '利用可能' : 'エラー')
    })
    
    console.log('エージェントシステムの初期化完了')
    return true
  } catch (error) {
    console.error('エージェントシステムの初期化に失敗:', error)
    return false
  }
}

// システムのヘルスチェック
export async function systemHealthCheck() {
  const agents = agentHelpers.getAllAgents()
  const results = await Promise.all(
    agents.map(agentName => agentHelpers.checkAgentStatus(agentName))
  )
  
  return {
    totalAgents: agents.length,
    availableAgents: results.filter(r => r.available).length,
    agents: results,
    healthy: results.every(r => r.available)
  }
}