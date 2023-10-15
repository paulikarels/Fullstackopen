import { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import Select from 'react-select';

const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

const EDIT_AUTHOR  = gql`
mutation editAuthor ($name: String!, $setBornTo: Int){
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`


const AuthorForm = ({ setError, authors }) => {
  
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [ changeBook, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })
  
  const [selectedOption, setSelectedOption] = useState(null);

  const submit = async (event) => {
    event.preventDefault()
    const name = selectedOption.value
    changeBook({ variables: { name, setBornTo: parseInt(born) } })
    
    setName('')
    setBorn('')

  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author not found')
    }
    }, [result.data])

  const selectAuthorOptions = authors.map((author) => (
    { value: author.name, label: author.name }
  ))

  return (
      <div> 
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
          name
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={selectAuthorOptions}
          />
          </div>
          <div>
          born
          <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
          />
          </div>
          <button type="submit">update author</button>
        </form>
    </div>
  )
  
}   

export default AuthorForm