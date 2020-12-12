import { useApolloClient } from '@apollo/client'
import React, { ReactNode, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import {
  useModalToggle,
  useReadGithubUser,
  useProfileDropdown,
} from '../../../../../hooks'
import { Fade } from '../../../../animation'
import { Dropdown } from '../../../../atoms'
import { localState } from '../../../../providers/ApolloProvider/cache'
import { Avatar } from './Avatar/Avatar'

interface IProfile {
  children?: ReactNode
}

export function Profile(props: IProfile) {
  const client = useApolloClient()

  const containerRef = useRef(null)
  const user = useReadGithubUser()
  const { isOpen, Portal, ref, setOpen } = useModalToggle<HTMLUListElement>()
  const { items, logout, called } = useProfileDropdown()

  if (called && logout === 'ok') {
    localState.currentJwtVar(null)
    client.cache.gc()

    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    )
  }

  function handleOpen() {
    setOpen(true)
  }

  return (
    <Wrapper {...props} ref={containerRef}>
      <Avatar image={user?.avatar_url} onClick={handleOpen} />
      <Fade show={isOpen}>
        <Portal
          domNode={containerRef.current}
          placementAroundContainer="bottom-left"
        >
          <Dropdown containerRef={ref} items={items} />
        </Portal>
      </Fade>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
`
