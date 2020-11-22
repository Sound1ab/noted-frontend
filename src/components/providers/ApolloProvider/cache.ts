import { InMemoryCache, makeVar } from '@apollo/client'

import { COLOR_MODE } from '../../../enums'

export const localState = {
  currentRepoNameVar: makeVar('NoteHub.Notebook'),
  currentPathVar: makeVar(''),
  currentThemeVar: makeVar<COLOR_MODE>(COLOR_MODE.DARK),
  cursorPositionVar: makeVar({
    ch: 0,
    line: 0,
    __typename: 'Position',
  }),
  currentJwtVar: makeVar<string | null>(null),
  accentColorVar: makeVar<string | null>(null),
  searchVar: makeVar(''),
}

export const fields = {
  currentRepoName() {
    return localState.currentRepoNameVar()
  },
  currentPath() {
    return localState.currentPathVar()
  },
  currentTheme() {
    return localState.currentThemeVar()
  },
  cursorPosition() {
    return localState.cursorPositionVar()
  },
  currentJwt() {
    return localState.currentJwtVar()
  },
  accentColor() {
    return localState.accentColorVar()
  },
  searchVar() {
    return localState.searchVar()
  },
}

export type Fields = typeof fields

export const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        ...fields,
        isDarkMode: {
          read() {
            return localState.currentThemeVar() === COLOR_MODE.DARK
          },
        },
      },
    },
    // File doesn't have an ID so apollo doesn't know how to merge new
    // request. Use 'path' as the ID and make sure to always overwrite
    // incoming messages
    File: {
      keyFields: ['path'],
      fields: {
        messages: {
          merge: false,
        },
      },
    },
  },
}
