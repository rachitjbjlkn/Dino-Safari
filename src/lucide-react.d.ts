declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number
    strokeWidth?: number
    absoluteStrokeWidth?: boolean
    color?: string
  }

  export type Icon = FC<IconProps>

  export const ArrowRight: Icon
  export const Plus: Icon
  export const Bone: Icon
  export const Dna: Icon
  export const Gem: Icon
  export const Leaf: Icon
  export const BookOpen: Icon
  export const ArrowUpRight: Icon
  export const ExternalLink: Icon
  export const Search: Icon
  export const Moon: Icon
  export const Sun: Icon
}
