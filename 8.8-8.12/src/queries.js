import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks  {
      title
      author
      published
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

export const CREATE_BOOK = gql`
  mutation addBook(
      $title: String!, 
      $author: String!, 
      $published: Int!,
      $genres: [String!],
    ) {
      addBook(
        title: $title,
        author: $author, 
        published: $published,
        genres: $genres
      ) {
        id
      }
    }
  
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor( 
    $name: String!, 
    $setBornTo: Int!,
  ) {
    editAuthor(
      name: $name,
      born: $setBornTo,
    ) {
      id
    }
  }
`