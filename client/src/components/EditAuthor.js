import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const EditAuthor = ({ authors, setError }) => {
  const [born, setBorn] = useState(0)
  const [name, setName] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message, 'error')
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, setBornTo: born }})
    setBorn(0)
    setName(authors ? authors[0].name : '')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <select onChange={({ target}) => setName(target.value)}>
          {authors.map((a) =>
            <option key={a.name} value={a.name}>{a.name}</option> 
          )}
        </select>
        <input
          type="number"
          value={born}
          onChange={({ target }) => setBorn(parseInt(target.value))}
        />
        <button type="submit" value="editAuthor">Update author</button>
      </form>

    </div>
  )
}

export default EditAuthor