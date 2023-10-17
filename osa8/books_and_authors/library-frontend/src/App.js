import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'
const App = () => {
  const [page, setPage] = useState('login')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      alert(`${subscriptionData.data.bookAdded.title} added successfully`)
    }
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  


  if (!token) {
    return (
      <div>
      
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'}  setError={notify} />
      
      <Books show={page === 'books'} />
      
      <LoginForm
          setToken={setToken}
          setError={notify}
          show={page === 'login'}
          setPage={setPage}
        />
    </div>
    )
  }
  
  const logoutUser = () => {
    window.localStorage.clear()
    setToken(null)
    client.resetStore()
  }

  return (
    <div>
      
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => logoutUser()}>logout</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'}  setError={notify} />
      
      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      <Recommend show={page === 'recommend'} />
    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

export default App
