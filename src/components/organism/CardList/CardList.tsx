import React, { useContext, useState } from 'react'
import { NoteContext } from '../../../Context'
import { INote, INotepad } from '../../../interfaces'
import {styled} from '../../../theme'
import { Heading, Icon, StickyContainer } from '../../atoms'
import { Card } from '../../molecules'

const Style = styled.div`
  position: relative;
  flex: 0 0 ${({theme}) => theme.spacing.xxxl};
  height: 100vh;
  
  .card-list-sticky {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`

export function CardList() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const notepads = useContext<INotepad[] | null>(NoteContext)
  const notes = notepads && notepads[0].notes

  return (
    <Style>
      <StickyContainer className="card-list-sticky">
        {notes && notes
          .map(note => (
            <Card
              key={note.id}
              id={note.id}
              title={note.title}
              excerpt={note.excerpt}
              createdAt={note.createdAt}
              isSelected={selectedCardId === note.id}
              handleSetSelectedCardId={setSelectedCardId}
            />
          ))}
      </StickyContainer>
    </Style>
  )
}
