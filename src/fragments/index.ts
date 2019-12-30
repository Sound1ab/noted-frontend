import gql from 'graphql-tag'

export const FileFragment = gql`
  fragment file on File {
    filename
    path
    content
    excerpt
    sha
    repo
    oldFilename
    _links {
      html
    }
  }
`

export const RepoFragment = gql`
  fragment repo on Repo {
    id
    node_id
    name
    full_name
    description
    private
  }
`

export const GithubUserFragment = gql`
  fragment githubUser on GithubUser {
    id
    login
    avatar_url
    html_url
    name
  }
`
