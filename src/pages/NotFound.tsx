import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => (
  <div className="page">
    <h1>Not found</h1>
    <p>We&apos;re sorry, the page you requested could not be found</p>
    <p>
      Please go back to the&nbsp;
      <Link to="/">home page</Link>
    </p>
  </div>
)

export default NotFound
