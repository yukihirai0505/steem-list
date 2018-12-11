import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class User extends Component {
  render() {
    const { location } = this.props
    console.log()
    return (
      <main>
        <h1>{location.pathname.replace('/', '')}</h1>
      </main>
    )
  }
}

export default withRouter(User)
