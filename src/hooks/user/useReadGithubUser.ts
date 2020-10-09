import { useQuery, gql } from '@apollo/client'

import {
  ReadGithubUserQuery,
  ReadGithubUserQueryVariables,
} from '../../components/apollo'
import { GithubUserFragment } from '../../fragments'

export const ReadGithubUserDocument = gql`
  ${GithubUserFragment}
  query ReadGithubUser {
    readGithubUser {
      ...githubUser
    }
  }
`

export function useReadGithubUser() {
  const { data } = useQuery<ReadGithubUserQuery, ReadGithubUserQueryVariables>(
    ReadGithubUserDocument
  )

  return data?.readGithubUser
}
