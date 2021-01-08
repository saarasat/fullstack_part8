import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'


const List = ({ genre }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS, { variables: { genre: genre } })
  if (loading) return <div>loading...</div>
  if (!data) return <div>No books available</div>
  if (error) return <div>Error loading books</div>

  return (
    <table>
      <tbody>
        <tr>
          <th>
            title
          </th>
          <th>
            author
          </th>
          <th>
            published
          </th>
        </tr>
        {data.allBooks.map(a =>
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

const Books = ({ show }) => {
  const [genre, setGenre] = useState('')
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (!show) {
    return null
  }

  if (loading) return <div>loading...</div>
  if (!data) return <div>Error loading books</div>
  if (error) return <div>Error loading books</div>

  const genreOptions = () => {
    const uniqueGenres = new Set()
    for (let book of data.allBooks) {
      uniqueGenres.add(...book.genres)
    }
    let genreArray = []
    for (let genre of uniqueGenres) {
      genreArray = [...genreArray, genre]
    }
    return genreArray
  }

  const genres = genreOptions()
  
  return (
    <div>
      <h2>Books</h2>
      <List genre={genre} />
      <table>
        <tbody>
          <tr>
            {genres.map(g =>
              g && (
                <td key={g}>
                  <button onClick={() => setGenre(g)}>{g}</button>
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Books