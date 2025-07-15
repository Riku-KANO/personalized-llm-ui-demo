export interface UIComponent {
  id: string
  type: 'hero' | 'card' | 'list' | 'button' | 'text' | 'sidebar' | 'navigation' | 'content-area' | 'container' | 'section' | 'header' | 'footer' | 'flex' | 'grid'
  title: string
  content: string
  backgroundColor: string
  textColor: string
  borderColor?: string
  customStyle?: string
  width?: 'full' | 'half' | 'third' | 'quarter' | 'sidebar' | 'auto' | 'fit'
  height?: 'auto' | 'screen' | 'full' | 'fit'
  position?: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'absolute' | 'relative' | 'fixed' | 'sticky'
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gridRows?: 1 | 2 | 3 | 4 | 5 | 6
  order?: number
  zIndex?: number
  children?: UIComponent[]
}

export interface GeneratedUI {
  type: 'dashboard' | 'profile' | 'gallery' | 'blog' | 'shop'
  title: string
  description: string
  primaryColor: string
  accentColor: string
  layout: 'vertical' | 'horizontal' | 'sidebar-left' | 'sidebar-right' | 'grid' | 'complex'
  components: UIComponent[]
}