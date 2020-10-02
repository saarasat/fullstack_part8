import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../queries'

const EditAuthor = ({ authors }) => {
  const [born, setBorn] = useState(0)
  const [name, setName] = useState('')
  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, setBornTo: born }})
    setBorn(0)
    setName('')
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