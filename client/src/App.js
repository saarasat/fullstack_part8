import { useApolloClient, useSubscription } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED } from './queries'


const App = () => {
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)
  const [type, setType] = useState('success')
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if ( token ) {
      setToken(token)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const { title, author } = subscriptionData.data.bookAdded
      notify(`New book, ${title} by ${author.name} has been added!`, 'success')
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (newMessage, newType) => {
    setMessage(newMessage)
    setType(newType)
    setTimeout(() => {
      setMessage(null)
    }, 6000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={() => logout()}>logout</button>
          </>
          :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
        setError={notify}
      />
      <Books
        show={page === 'books'}
      />
      <NewBook
        setError={notify}
        show={page === 'add'}
      />
      <Recommendations
        show={page === 'recommendations'}
      />
      <Login
        setToken={setToken}
        setError={notify}
        show={page === 'login'}
        setPage={setPage} 
      />
      <Notify message={message} type={type} />
    </div>
  )
}

export default App