import React, { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'


const Login = ({ setError, setToken, show, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
      setError(error, "Error")
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setPage('books')
    }
  }, [result.data, setPage, setToken])

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  if (!show) return null

  return (
    <form onSubmit={submit}>
      <label>
        Username:
      </label>
      <input 
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}  
      />
      <label>
        Password:
      </label>
      <input 
        type="text"
        value={password}
        onChange={({ target }) => setPassword(target.value)}  
      />
      <button type="submit">login</button>
    </form>
  )
}

export default Login