import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { RECOMMENDATIONS } from '../queries'


const Recommendations = (props) => {
  const { loading, error, data } = useQuery(RECOMMENDATIONS)

  if (!props.show) {
    return null
  }

  if (loading) return <div>loading...</div>

  if (error) return <div>Error loading books</div>

  const user = data.me
  const books = data.allBooks.filter(b => b.genres.includes(user.favoriteGenre))
  
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
    </div>
    
  )
}

export default Recommendations