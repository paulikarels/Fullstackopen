import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query {
    allBooks { 
        title 
        author
        published 
        genres
    }
  }
`

const Books = ({show}) => {
  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })

  if (!show) {
    return null
  }

  if ( result.loading ) {
    return <div>loading...</div>
  }
  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books