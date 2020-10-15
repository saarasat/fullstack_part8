import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'


const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }

  if (loading) return <div>loading...</div>

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
  const books = data.allBooks.filter(b => b.genres.includes(genre))
  
  return (
    <div>
      <h2>books</h2>

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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            {genres.map(g =>
              <td key={g}>
                <button onClick={() => setGenre(g)}>{g}</button>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Books