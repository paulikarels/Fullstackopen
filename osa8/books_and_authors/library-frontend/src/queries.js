import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ADD_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]){
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

export const ALL_BOOKS = gql`
  query {
    allBooks { 
        title 
        author {
          name
          born
          bookCount
        }
        published 
        genres
    }
  }
`
export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`
export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    author {
      bookCount
      born
      id
      name
    }
    genres
    id
    published
    title
  }
`;

export const BOOK_ADDED = gql`
  subscription BookAdded {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;