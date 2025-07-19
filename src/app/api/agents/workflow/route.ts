import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeMultiAgentWorkflow } from '@/agents/multi-agent-system'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workflowType, userRequest, preferences } = await request.json()
    
    if (!workflowType || !userRequest) {
      return NextResponse.json({ 
        error: 'Workflow type and user request are required' 
      }, { status: 400 })
    }

    // 有効なワークフロータイプのチェック
    const validWorkflowTypes = ['generate-and-evaluate', 'iterative-improvement', 'ab-testing']
    if (!validWorkflowTypes.includes(workflowType)) {
      return NextResponse.json({ 
        error: 'Invalid workflow type' 
      }, { status: 400 })
    }

    // マルチエージェントワークフローの実行
    const result = await executeMultiAgentWorkflow(
      workflowType,
      userRequest,
      session.user.id,
      preferences
    )

    return NextResponse.json({ 
      success: true,
      result: result.text,
      workflowType,
      agent: 'coordinator'
    })
  } catch (error) {
    console.error('Multi-agent workflow error:', error)
    return NextResponse.json({ 
      error: 'Failed to execute multi-agent workflow' 
    }, { status: 500 })
  }
}