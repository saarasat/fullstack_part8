import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query allBooks(
    $genre: String
  ) {
    allBooks (
      genre: $genre
    ) {
      title
      author {
        name
      }
      published
      genres  
    }
  } 
`

export const RECOMMENDATIONS = gql`
  query {
    allBooks  {
      title
      author {
        name
      }
      published
      genres
    }
    me {
      username
      favoriteGenre
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
        title
        author {
          name
        }
        published
        genres
      }
    }
  
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
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

export const LOGIN = gql`
  mutation login(
    $username: String!,
    $password: String!
  ) {
    login(
      username: $username, 
      password: $password
    ) {
      value
    }
  }
`