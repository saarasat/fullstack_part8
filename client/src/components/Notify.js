import React from 'react'

const Notify = ({ message, type }) => {

  const colors = {
    success: 'green',
    error: 'red'
  }

  if ( !message ) {
    return null
  }
  return (
    <div style={{ color: colors[type] }}>
      {message}
    </div>
  )
}

export default Notify