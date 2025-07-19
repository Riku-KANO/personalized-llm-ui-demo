import { describe, it, expect, beforeEach } from 'vitest'
import { UIEvaluator, EvaluationContext } from '@/lib/ui-evaluator'

describe('UI Evaluator', () => {
  let evaluator: UIEvaluator

  beforeEach(() => {
    evaluator = new UIEvaluator()
  })

  describe('Single UI Evaluation', () => {
    it('should evaluate a simple button UI', async () => {
      const context: EvaluationContext = {
        userPrompt: 'Create a blue submit button',
        generatedUI: {
          type: 'complex',
          title: 'Submit Button',
          description: 'A simple submit button',
          primaryColor: '#3b82f6',
          accentColor: '#1d4ed8',
          layout: 'vertical',
          components: [
            {
              id: '1',
              type: 'button',
              title: 'Submit',
              content: 'Submit',
              backgroundColor: '#3b82f6',
              textColor: '#ffffff'
            }
          ]
        },
        userPreferences: 'I prefer modern, clean designs with blue color schemes'
      }

      const result = await evaluator.evaluateUI(context)

      expect(result).toHaveProperty('score')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(10)
      expect(result.criteria).toHaveProperty('functionality')
      expect(result.criteria).toHaveProperty('usability')
      expect(result.criteria).toHaveProperty('accessibility')
      expect(result.criteria).toHaveProperty('design')
      expect(result.criteria).toHaveProperty('responsiveness')
    }, 30000)

    it('should evaluate a complex form UI', async () => {
      const context: EvaluationContext = {
        userPrompt: 'Create a user registration form with name, email, and password fields',
        generatedUI: {
          type: 'complex',
          title: 'Registration Form',
          description: 'User registration form',
          primaryColor: '#3b82f6',
          accentColor: '#1d4ed8',
          layout: 'vertical',
          components: [
            {
              id: '1',
              type: 'container',
              title: 'Form Container',
              content: 'Registration form container',
              backgroundColor: '#ffffff',
              textColor: '#000000',
              children: [
                {
                  id: '2',
                  type: 'text',
                  title: 'Name Input',
                  content: 'Full Name',
                  backgroundColor: '#ffffff',
                  textColor: '#000000'
                },
                {
                  id: '3',
                  type: 'text',
                  title: 'Email Input',
                  content: 'Email',
                  backgroundColor: '#ffffff',
                  textColor: '#000000'
                },
                {
                  id: '4',
                  type: 'text',
                  title: 'Password Input',
                  content: 'Password',
                  backgroundColor: '#ffffff',
                  textColor: '#000000'
                },
                {
                  id: '5',
                  type: 'button',
                  title: 'Register Button',
                  content: 'Register',
                  backgroundColor: '#3b82f6',
                  textColor: '#ffffff'
                }
              ]
            }
          ]
        }
      }

      const result = await evaluator.evaluateUI(context)

      expect(result.score).toBeGreaterThan(5) // Should be reasonably good
      expect(result.criteria.functionality).toBeGreaterThan(6) // Form should be functional
    }, 30000)
  })

  describe('UI Comparison', () => {
    it('should compare two different button designs', async () => {
      const context1: EvaluationContext = {
        userPrompt: 'Create a submit button',
        generatedUI: {
          type: 'complex',
          title: 'Blue Button',
          description: 'A blue submit button',
          primaryColor: '#3b82f6',
          accentColor: '#1d4ed8',
          layout: 'vertical',
          components: [
            {
              id: '1',
              type: 'button',
              title: 'Submit',
              content: 'Submit',
              backgroundColor: '#3b82f6',
              textColor: '#ffffff'
            }
          ]
        }
      }

      const context2: EvaluationContext = {
        userPrompt: 'Create a submit button',
        generatedUI: {
          type: 'complex',
          title: 'Gray Button',
          description: 'A gray submit button',
          primaryColor: '#6b7280',
          accentColor: '#4b5563',
          layout: 'vertical',
          components: [
            {
              id: '1',
              type: 'button',
              title: 'Submit',
              content: 'Submit',
              backgroundColor: '#6b7280',
              textColor: '#ffffff'
            }
          ]
        }
      }

      const comparison = await evaluator.compareUIs(context1, context2)

      expect(comparison).toHaveProperty('winner')
      expect(comparison).toHaveProperty('ui1Score')
      expect(comparison).toHaveProperty('ui2Score')
      expect(comparison).toHaveProperty('comparison')
      expect(['ui1', 'ui2', 'tie']).toContain(comparison.winner)
    }, 45000)
  })

  describe('Batch Evaluation', () => {
    it('should evaluate multiple UIs and generate statistics', async () => {
      const contexts: EvaluationContext[] = [
        {
          userPrompt: 'Create a simple button',
          generatedUI: {
            type: 'complex',
            title: 'Simple Button',
            description: 'A simple button',
            primaryColor: '#3b82f6',
            accentColor: '#1d4ed8',
            layout: 'vertical',
            components: [
              {
                id: '1',
                type: 'button',
                title: 'Click me',
                content: 'Click me',
                backgroundColor: '#3b82f6',
                textColor: '#ffffff'
              }
            ]
          }
        },
        {
          userPrompt: 'Create a text input',
          generatedUI: {
            type: 'complex',
            title: 'Text Input',
            description: 'A text input field',
            primaryColor: '#3b82f6',
            accentColor: '#1d4ed8',
            layout: 'vertical',
            components: [
              {
                id: '1',
                type: 'text',
                title: 'Text Input',
                content: 'Enter text',
                backgroundColor: '#ffffff',
                textColor: '#000000'
              }
            ]
          }
        }
      ]

      const results = await evaluator.batchEvaluate(contexts)
      const stats = evaluator.generateStats(results)

      expect(results).toHaveLength(2)
      expect(stats).toHaveProperty('averageScore')
      expect(stats).toHaveProperty('minScore')
      expect(stats).toHaveProperty('maxScore')
      expect(stats).toHaveProperty('criteriaAverages')
      expect(stats.totalEvaluations).toBe(2)
    }, 60000)
  })
})