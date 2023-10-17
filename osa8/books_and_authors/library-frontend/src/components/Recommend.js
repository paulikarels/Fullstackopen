import { gql, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
const ALL_USERS = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

const ALL_BOOKS = gql`
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


const Recommend = ({ show }) => {
  const [filteredBooks, setFilteredBooks] = useState([])
  
  const userResult = useQuery(ALL_USERS, ALL_BOOKS, {
    pollInterval: 2000
  })
  const resultBooks = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (userResult.data) {
      const books = resultBooks.data.allBooks
      const filterBooks  = []
      books.forEach((book) => {
        book.genres.forEach((genre) => {
         
          if (userResult.data.me.favoriteGenre === genre)  {
            filterBooks.push(book)
          }
        })
      })
      setFilteredBooks(filterBooks)
      
    }
  }, [userResult])


  if (!show) {
    return null
  }

  if ( userResult.loading ) {
    return <div>loading...</div>
  }

  const books = resultBooks.data.allBooks
  return (
    <div>
      <h2>recommendations</h2>
      <div>
         books in your favourite genre  <b>{userResult.data.me.favoriteGenre}</b>
      </div>
      <table>
        <tbody>
        <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
