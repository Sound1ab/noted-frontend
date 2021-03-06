import { gql, useQuery } from '@apollo/client'

import {
  ReadGithubUserAccessTokenQuery,
  ReadGithubUserAccessTokenQueryVariables,
} from '../../components/apollo/generated_components_typings'

export const ReadGithubUserAccessTokenDocument = gql`
  query ReadGithubUserAccessToken($code: String!, $state: String!) {
    readGithubUserAccessToken(code: $code, state: $state)
  }
`

export function useReadGithubUserAccessToken(
  code: string | null,
  state: string | null
) {
  const { data, error } = useQuery<
    ReadGithubUserAccessTokenQuery,
    ReadGithubUserAccessTokenQueryVariables
  >(ReadGithubUserAccessTokenDocument, {
    variables: {
      code: code ?? '',
      state: state ?? '',
    },
  })

  return { jwt: data && data.readGithubUserAccessToken, error }
}
