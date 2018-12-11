import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class GenericNotFound extends Component {
  render() {
    return (
      <main>
        <h1>Not Found</h1>
      </main>
    )
  }
}

export default withRouter(GenericNotFound)
