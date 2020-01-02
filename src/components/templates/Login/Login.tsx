import React from 'react'
import { Redirect } from 'react-router-dom'

import { LOCAL_STORAGE } from '../../../enums'
import { useLocalStorage } from '../../../hooks'
import { styled } from '../../../theme'
import { ButtonLink, Icon } from '../../atoms'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL
const STATE = process.env.REACT_APP_STATE
const SCOPE = process.env.REACT_APP_SCOPE

const Style = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .Login-button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.company.github};
    color: ${({ theme }) => theme.colors.link.active};
  }
`

export function Login() {
  const [accessToken] = useLocalStorage(LOCAL_STORAGE.KEY)

  return accessToken ? (
    <Redirect
      to={{
        pathname: '/dashboard',
      }}
    />
  ) : (
    <Style>
      <ButtonLink
        className="Login-button"
        href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&state=${STATE}&scope=${SCOPE}`}
      >
        <Icon icon="github" prefix="fab" size="lg" marginRight />
        Log in with Github
      </ButtonLink>
    </Style>
  )
}
