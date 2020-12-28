import React from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import { useCreateRepo } from '../../../hooks/repo/useCreateRepo'
import { useReadRepo } from '../../../hooks/repo/useReadRepo'
import image from '../../../images/app_development_PNG.png'
import { GithubButton } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { Spinner } from '../../atoms/Spinner/Spinner'
import { ErrorToast } from '../../atoms/Toast/Toast'

function Setup() {
  const { repo } = useReadRepo()
  const [createRepo, { loading, data }] = useCreateRepo()

  if (repo || data?.createRepo?.name) {
    return (
      <Redirect
        to={{
          pathname: '/dashboard',
        }}
      />
    )
  }

  async function handleOnClick() {
    try {
      await createRepo()
    } catch {
      ErrorToast(`There was an issue create your repository. Please try again.`)
    }
  }

  return (
    <Wrapper>
      <DialogBox>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Image src={image} alt="Man sat on laptop uploading" />
            <Heading>Create your Notebook</Heading>
            <Copy>
              To save your notes we need to setup a new repository in Github.
              The repository will be called NoteHub.Notebooks. Before
              continuing, please make sure a repository under that name does not
              already exist.
            </Copy>
            <Button onClick={handleOnClick}>
              <Icon icon="github" prefix="fab" size="lg" marginRight />
              Setup repository
            </Button>
          </>
        )}
      </DialogBox>
    </Wrapper>
  )
}

export { Setup as default }

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Image = styled.img`
  max-width: ${({ theme }) => theme.spacing.xxxl};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`

const Heading = styled.h3`
  color: var(--white) !important;
`

const DialogBox = styled.div`
  max-width: 50ch;
  width: 100%;
  max-height: 585px;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.m};
  background-color: var(--accent-primary);
  text-align: center;
  border-radius: ${({ theme }) => theme.spacing.xxs};
`

const Copy = styled.p`
  color: var(--white) !important;
  margin-bottom: ${({ theme }) => theme.spacing.m};
`

const Button = styled(GithubButton)`
  margin: 0 auto;
`