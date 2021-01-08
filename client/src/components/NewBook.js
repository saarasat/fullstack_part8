import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, CREATE_BOOK, RECOMMENDATIONS } from '../queries'

const NewBook = ({ show, setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState(2000)
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS } ],
    onError: (error) => {
      console.log(error.graphQLErrors[0].extensions.code)
      if (error.graphQLErrors[0].extensions.code === "BAD_USER_INPUT") {
        setError("Check the title and author, they should be more than 4 characters")
      } else {
        setError("Oh ou, something went wrong, try again")
      }
      setTimeout(() => setError(''), 5000)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: RECOMMENDATIONS })
      store.writeQuery({
        query: RECOMMENDATIONS,
        data: {
          ...dataInStore,
          allBooks: [...dataInStore.allBooks, response.data.addBook]
        }
      })
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, author, published, genres }})

    setTitle('')
    setPublished(2000)
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          titles
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook