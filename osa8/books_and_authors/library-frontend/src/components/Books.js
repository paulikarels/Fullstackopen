import {  useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = ({show}) => {
  const [genres, setGenres] = useState([])
  const [selectGenre, setSelectedGenre] = useState('all genres')
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })

  useEffect(() => {
    if (result.data) {
      const getBooks = result.data.allBooks
      setBooks(getBooks)
      let genres = []
      getBooks.forEach((book) => {
        book.genres.forEach((genre) => {
          if (genres.indexOf(genre) === -1) {
            genres.push(genre)
          }
        })
      })
      genres.push('all genres')
      setGenres(genres)
    }
  }, [result])

  useEffect(() => {
    if (selectGenre === 'all genres') {
      setFilteredBooks(books)
    } else {
      setFilteredBooks(
        books.filter((b) => b.genres.indexOf(selectGenre) !== -1)
      )
    }
  }, [books, selectGenre])


  if (!show) {
    return null
  }

  if ( result.loading ) {
    return <div>loading...</div>
  }


  //const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {selectGenre !== 'all genres' &&
      <div>
         in genre <b>{selectGenre}</b>
      </div>
      }

      {selectGenre === 'all genres' &&
      <div>
         in <b>all genres</b>
      </div>
      }
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
      {genres.map(genre => 
        <button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>
      )}
    </div>
  )
}

export default Books
