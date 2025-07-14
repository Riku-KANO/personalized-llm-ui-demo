'use client'

interface UIComponent {
  type: 'hero' | 'card' | 'list' | 'button' | 'text' | 'sidebar' | 'navigation' | 'content-area'
  title: string
  content: string
  backgroundColor: string
  textColor: string
  borderColor?: string
  customStyle?: string
  width?: 'full' | 'half' | 'third' | 'quarter' | 'sidebar'
  position?: 'left' | 'right' | 'center' | 'top' | 'bottom'
}

interface GeneratedUI {
  type: 'dashboard' | 'profile' | 'gallery' | 'blog' | 'shop'
  title: string
  description: string
  primaryColor: string
  accentColor: string
  layout: 'vertical' | 'horizontal' | 'sidebar-left' | 'sidebar-right' | 'grid'
  components: UIComponent[]
}

interface DynamicUIProps {
  ui: GeneratedUI
}

export default function DynamicUI({ ui }: DynamicUIProps) {
  const getWidthClass = (width?: string) => {
    switch (width) {
      case 'half': return 'w-1/2'
      case 'third': return 'w-1/3'
      case 'quarter': return 'w-1/4'
      case 'sidebar': return 'w-64'
      default: return 'w-full'
    }
  }

  const getLayoutClass = () => {
    switch (ui.layout) {
      case 'horizontal': return 'flex flex-row flex-wrap'
      case 'sidebar-left': return 'flex flex-row'
      case 'sidebar-right': return 'flex flex-row-reverse'
      case 'grid': return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      default: return 'flex flex-col space-y-6'
    }
  }

  const renderComponent = (component: UIComponent, index: number) => {
    const baseStyle = {
      backgroundColor: component.backgroundColor,
      color: component.textColor,
      borderColor: component.borderColor,
    }

    const customClasses = component.customStyle || ''
    const widthClass = getWidthClass(component.width)
    const isFlexLayout = ui.layout === 'horizontal' || ui.layout.includes('sidebar')

    const wrapperClasses = isFlexLayout ? `${widthClass} ${customClasses}` : customClasses

    switch (component.type) {
      case 'hero':
        return (
          <div 
            key={index} 
            className={`text-center py-16 ${wrapperClasses}`}
            style={baseStyle}
          >
            <h1 className="text-4xl font-bold mb-4">{component.title}</h1>
            <p className="text-xl opacity-90">{component.content}</p>
          </div>
        )

      case 'card':
        return (
          <div 
            key={index} 
            className={`p-6 rounded-lg shadow-lg ${wrapperClasses}`}
            style={baseStyle}
          >
            <h3 className="text-xl font-semibold mb-3">{component.title}</h3>
            <p className="opacity-80">{component.content}</p>
          </div>
        )

      case 'list':
        const items = component.content.split('\n').filter(item => item.trim())
        return (
          <div 
            key={index} 
            className={`p-4 ${wrapperClasses}`}
            style={baseStyle}
          >
            <h3 className="text-lg font-semibold mb-3">{component.title}</h3>
            <ul className="space-y-2">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center">
                  <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'button':
        return (
          <div 
            key={index} 
            className={`text-center py-4 ${wrapperClasses}`}
            style={baseStyle}
          >
            <button 
              className="px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: ui.accentColor, color: component.textColor }}
            >
              {component.title}
            </button>
            <p className="mt-2 text-sm opacity-75">{component.content}</p>
          </div>
        )

      case 'text':
        return (
          <div 
            key={index} 
            className={`p-4 ${wrapperClasses}`}
            style={baseStyle}
          >
            <h3 className="text-lg font-semibold mb-2">{component.title}</h3>
            <p className="leading-relaxed">{component.content}</p>
          </div>
        )

      case 'sidebar':
        return (
          <div 
            key={index} 
            className={`p-4 h-screen overflow-y-auto ${wrapperClasses}`}
            style={baseStyle}
          >
            <h3 className="text-lg font-semibold mb-4">{component.title}</h3>
            <nav className="space-y-2">
              {component.content.split('\n').filter(item => item.trim()).map((item, itemIndex) => (
                <a key={itemIndex} href="#" className="block px-2 py-1 rounded hover:bg-black hover:bg-opacity-10">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )

      case 'navigation':
        return (
          <nav 
            key={index} 
            className={`p-4 ${wrapperClasses}`}
            style={baseStyle}
          >
            <h3 className="text-lg font-semibold mb-3">{component.title}</h3>
            <div className="flex flex-wrap gap-4">
              {component.content.split('\n').filter(item => item.trim()).map((item, itemIndex) => (
                <a key={itemIndex} href="#" className="px-3 py-2 rounded hover:bg-black hover:bg-opacity-10">
                  {item}
                </a>
              ))}
            </div>
          </nav>
        )

      case 'content-area':
        return (
          <div 
            key={index} 
            className={`p-6 flex-1 ${wrapperClasses}`}
            style={baseStyle}
          >
            <h2 className="text-2xl font-bold mb-4">{component.title}</h2>
            <div className="prose max-w-none">
              {component.content.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: ui.primaryColor }}
        >
          <h2 className="text-3xl font-bold mb-2">{ui.title}</h2>
          <p className="text-lg opacity-90">{ui.description}</p>
          <div className="mt-2 text-sm opacity-75">
            タイプ: {ui.type} | レイアウト: {ui.layout} | プライマリカラー: {ui.primaryColor} | アクセントカラー: {ui.accentColor}
          </div>
        </div>

        <div className={`p-6 ${getLayoutClass()}`}>
          {ui.components.map((component, index) => renderComponent(component, index))}
        </div>

        <div className="bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            このUIはあなたの嗜好に基づいてLLMが動的に生成しました
          </p>
        </div>
      </div>
    </div>
  )
}