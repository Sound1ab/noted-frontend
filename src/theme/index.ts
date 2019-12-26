import baseStyled, { ThemedStyledInterface } from 'styled-components'
import { VerticalRhythm } from 'typography'

import { colors, createSpacing } from './theme'

type TSpacing = ReturnType<typeof createSpacing>
export type TColors = typeof colors['dark']

interface IHeading {
  fontSize: string
  lineHeight: string
  marginBottom: string
}

export interface ITheme {
  colors: TColors
  spacing: TSpacing
  rhythm: VerticalRhythm['rhythm']
  typographyStyles: {
    h1: IHeading
    h2: IHeading
    h3: IHeading
    h4: IHeading
    h5: IHeading
    h6: IHeading
    html: IHeading
  }
}

export const styled = baseStyled as ThemedStyledInterface<ITheme>
