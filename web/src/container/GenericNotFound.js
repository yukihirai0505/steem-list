import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class GenericNotFound extends Component {
  render() {
    const { location } = this.props
    console.log(location.pathname)
    return (
      <main>
        <h1>Not Found</h1>
      </main>
    )
  }
}

export default withRouter(GenericNotFound)
