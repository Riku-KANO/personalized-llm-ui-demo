'use client'

import { UIComponent, GeneratedUI } from '@/types/ui'
import { CSSProperties } from 'react'

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
      case 'auto': return 'w-auto'
      case 'fit': return 'w-fit'
      default: return 'w-full'
    }
  }

  const getHeightClass = (height?: string) => {
    switch (height) {
      case 'screen': return 'h-screen'
      case 'full': return 'h-full'
      case 'fit': return 'h-fit'
      default: return 'h-auto'
    }
  }

  const getPositionClass = (position?: string) => {
    switch (position) {
      case 'absolute': return 'absolute'
      case 'relative': return 'relative'
      case 'fixed': return 'fixed'
      case 'sticky': return 'sticky'
      default: return ''
    }
  }

  const getFlexDirectionClass = (flexDirection?: string) => {
    switch (flexDirection) {
      case 'row': return 'flex-row'
      case 'column': return 'flex-col'
      case 'row-reverse': return 'flex-row-reverse'
      case 'column-reverse': return 'flex-col-reverse'
      default: return 'flex-col'
    }
  }

  const getAlignItemsClass = (alignItems?: string) => {
    switch (alignItems) {
      case 'start': return 'items-start'
      case 'center': return 'items-center'
      case 'end': return 'items-end'
      case 'stretch': return 'items-stretch'
      case 'baseline': return 'items-baseline'
      default: return ''
    }
  }

  const getJustifyContentClass = (justifyContent?: string) => {
    switch (justifyContent) {
      case 'start': return 'justify-start'
      case 'center': return 'justify-center'
      case 'end': return 'justify-end'
      case 'between': return 'justify-between'
      case 'around': return 'justify-around'
      case 'evenly': return 'justify-evenly'
      default: return ''
    }
  }

  const getGapClass = (gap?: string) => {
    switch (gap) {
      case 'none': return 'gap-0'
      case 'xs': return 'gap-1'
      case 'sm': return 'gap-2'
      case 'md': return 'gap-4'
      case 'lg': return 'gap-6'
      case 'xl': return 'gap-8'
      default: return 'gap-4'
    }
  }

  const getPaddingClass = (padding?: string) => {
    switch (padding) {
      case 'none': return 'p-0'
      case 'xs': return 'p-1'
      case 'sm': return 'p-2'
      case 'md': return 'p-4'
      case 'lg': return 'p-6'
      case 'xl': return 'p-8'
      default: return ''
    }
  }

  const getMarginClass = (margin?: string) => {
    switch (margin) {
      case 'none': return 'm-0'
      case 'xs': return 'm-1'
      case 'sm': return 'm-2'
      case 'md': return 'm-4'
      case 'lg': return 'm-6'
      case 'xl': return 'm-8'
      default: return ''
    }
  }

  const getGridColsClass = (gridCols?: number) => {
    switch (gridCols) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-2'
      case 3: return 'grid-cols-3'
      case 4: return 'grid-cols-4'
      case 5: return 'grid-cols-5'
      case 6: return 'grid-cols-6'
      case 12: return 'grid-cols-12'
      default: return 'grid-cols-1'
    }
  }

  const getGridRowsClass = (gridRows?: number) => {
    switch (gridRows) {
      case 1: return 'grid-rows-1'
      case 2: return 'grid-rows-2'
      case 3: return 'grid-rows-3'
      case 4: return 'grid-rows-4'
      case 5: return 'grid-rows-5'
      case 6: return 'grid-rows-6'
      default: return 'grid-rows-1'
    }
  }

  const getPositionStyles = (position?: string): CSSProperties => {
    if (!position) return {}
    
    switch (position) {
      case 'left':
        return { left: 0 }
      case 'right':
        return { right: 0 }
      case 'center':
        return { left: '50%', transform: 'translateX(-50%)' }
      case 'top':
        return { top: 0 }
      case 'bottom':
        return { bottom: 0 }
      default:
        return {}
    }
  }

  const renderComponent = (component: UIComponent, index: number) => {
    const baseStyle: CSSProperties = {
      backgroundColor: component.backgroundColor,
      color: component.textColor,
      borderColor: component.borderColor,
      order: component.order,
      zIndex: component.zIndex,
      ...getPositionStyles(component.position)
    }

    const customClasses = component.customStyle || ''
    const widthClass = getWidthClass(component.width)
    const heightClass = getHeightClass(component.height)
    const positionClass = getPositionClass(component.position)
    const paddingClass = getPaddingClass(component.padding)
    const marginClass = getMarginClass(component.margin)
    
    const isFlexComponent = component.type === 'flex'
    const isGridComponent = component.type === 'grid'
    
    let wrapperClasses = [
      widthClass,
      heightClass,
      positionClass,
      paddingClass,
      marginClass,
      customClasses
    ].filter(Boolean).join(' ')

    if (isFlexComponent) {
      const flexClasses = [
        'flex',
        getFlexDirectionClass(component.flexDirection),
        getAlignItemsClass(component.alignItems),
        getJustifyContentClass(component.justifyContent),
        getGapClass(component.gap)
      ].filter(Boolean).join(' ')
      wrapperClasses = `${wrapperClasses} ${flexClasses}`
    }

    if (isGridComponent) {
      const gridClasses = [
        'grid',
        getGridColsClass(component.gridCols),
        getGridRowsClass(component.gridRows),
        getGapClass(component.gap)
      ].filter(Boolean).join(' ')
      wrapperClasses = `${wrapperClasses} ${gridClasses}`
    }

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
            className={`rounded-lg shadow-lg ${wrapperClasses}`}
            style={baseStyle}
          >
            {component.title && <h3 className="text-xl font-semibold mb-3">{component.title}</h3>}
            {component.content && <p className="opacity-80">{component.content}</p>}
            {component.children && (
              <div className="mt-4">
                {component.children.map((child, childIndex) => 
                  renderComponent(child, childIndex)
                )}
              </div>
            )}
          </div>
        )

      case 'list':
        const items = component.content ? component.content.split('\n').filter(item => item.trim()) : []
        return (
          <div 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-3">{component.title}</h3>}
            {items.length > 0 && (
              <ul className="space-y-2">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {component.children && component.children.map((child, childIndex) => 
              renderComponent(child, childIndex)
            )}
          </div>
        )

      case 'button':
        return (
          <div 
            key={index} 
            className={`text-center ${wrapperClasses}`}
            style={baseStyle}
          >
            <button 
              className="px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: ui.accentColor, color: component.textColor }}
            >
              {component.title}
            </button>
            {component.content && <p className="mt-2 text-sm opacity-75">{component.content}</p>}
          </div>
        )

      case 'text':
        return (
          <div 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-2">{component.title}</h3>}
            {component.content && <p className="leading-relaxed">{component.content}</p>}
            {component.children && component.children.map((child, childIndex) => 
              renderComponent(child, childIndex)
            )}
          </div>
        )

      case 'sidebar':
        return (
          <aside 
            key={index} 
            className={`overflow-y-auto ${wrapperClasses}`}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-4">{component.title}</h3>}
            {component.content && (
              <nav className="space-y-2">
                {component.content.split('\n').filter(item => item.trim()).map((item, itemIndex) => (
                  <a key={itemIndex} href="#" className="block px-2 py-1 rounded hover:bg-black hover:bg-opacity-10">
                    {item}
                  </a>
                ))}
              </nav>
            )}
            {component.children && (
              <div className="mt-4">
                {component.children.map((child, childIndex) => 
                  renderComponent(child, childIndex)
                )}
              </div>
            )}
          </aside>
        )

      case 'navigation':
        return (
          <nav 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-3">{component.title}</h3>}
            <div className="flex flex-wrap gap-4">
              {component.content && component.content.split('\n').filter(item => item.trim()).map((item, itemIndex) => (
                <a key={itemIndex} href="#" className="px-3 py-2 rounded hover:bg-black hover:bg-opacity-10">
                  {item}
                </a>
              ))}
            </div>
            {component.children && component.children.map((child, childIndex) => 
              renderComponent(child, childIndex)
            )}
          </nav>
        )

      case 'content-area':
        return (
          <main 
            key={index} 
            className={`flex-1 ${wrapperClasses}`}
            style={baseStyle}
          >
            {component.title && <h2 className="text-2xl font-bold mb-4">{component.title}</h2>}
            {component.content && (
              <div className="prose max-w-none">
                {component.content.split('\n').map((paragraph, pIndex) => (
                  paragraph.trim() && <p key={pIndex} className="mb-4">{paragraph}</p>
                ))}
              </div>
            )}
            {component.children && (
              <div className="mt-4">
                {component.children.map((child, childIndex) => 
                  renderComponent(child, childIndex)
                )}
              </div>
            )}
          </main>
        )

      case 'container':
        return (
          <div 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-2">{component.title}</h3>}
            {component.children && component.children.map((child, childIndex) => 
              renderComponent(child, childIndex)
            )}
          </div>
        )

      case 'section':
        return (
          <section 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h2 className="text-2xl font-bold mb-4">{component.title}</h2>}
            {component.children && (
              <div className="space-y-4">
                {component.children.map((child, childIndex) => 
                  renderComponent(child, childIndex)
                )}
              </div>
            )}
          </section>
        )

      case 'header':
        return (
          <header 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h1 className="text-3xl font-bold">{component.title}</h1>}
            {component.content && <p className="text-lg mt-2">{component.content}</p>}
            {component.children && (
              <div className="mt-4">
                {component.children.map((child, childIndex) => 
                  renderComponent(child, childIndex)
                )}
              </div>
            )}
          </header>
        )

      case 'footer':
        return (
          <footer 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            <div className="text-center">
              {component.title && <h3 className="text-lg font-semibold mb-2">{component.title}</h3>}
              {component.content && <p className="text-sm">{component.content}</p>}
            </div>
            {component.children && (
              <div className="mt-4">
                {component.children.map((child, childIndex) => 
                  renderComponent(child, childIndex)
                )}
              </div>
            )}
          </footer>
        )

      case 'flex':
        return (
          <div 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-2">{component.title}</h3>}
            {component.children && component.children.map((child, childIndex) => 
              renderComponent(child, childIndex)
            )}
          </div>
        )

      case 'grid':
        return (
          <div 
            key={index} 
            className={wrapperClasses}
            style={baseStyle}
          >
            {component.title && <h3 className="text-lg font-semibold mb-2">{component.title}</h3>}
            {component.children && component.children.map((child, childIndex) => 
              renderComponent(child, childIndex)
            )}
          </div>
        )

      default:
        return null
    }
  }

  const getMainLayoutClass = () => {
    switch (ui.layout) {
      case 'horizontal':
        return 'flex flex-row flex-wrap gap-6'
      case 'sidebar-left':
        return 'flex flex-row min-h-screen'
      case 'sidebar-right':
        return 'flex flex-row-reverse min-h-screen'
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'complex':
        return 'min-h-screen relative'
      default:
        return 'flex flex-col gap-6'
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

        <div className={`${getMainLayoutClass()}`}>
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