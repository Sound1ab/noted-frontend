import React from 'react'
import { GoogleFont, TypographyStyle } from 'react-typography'
import {NoteContext} from '../Context'
import {useData} from '../hooks'
import { INotepad } from '../interfaces'
import { typography } from '../theme/typography'
import { Container } from './atoms'
import {IIndex} from './templates'
import { GlobalStyle, ThemeProvider } from './utility'

export function App() {
  const [data, loading] = useData<INotepad[]>()

  return (
    <ThemeProvider>
      <NoteContext.Provider value={data}>
        <GlobalStyle />
        <TypographyStyle typography={typography} />
        <GoogleFont typography={typography} />
        <Container>
          {loading ? (
            'loading'
          ) : (
            <IIndex />
          )}
        </Container>
      </NoteContext.Provider>
    </ThemeProvider>
  )
}
