import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Home extends Component {
  static propTypes = {
    handleLogin: PropTypes.any
  }

  render() {
    const { handleLogin } = this.props
    return (
      <main>
        <h1>Steem List</h1>
        <button onClick={() => handleLogin()}>SignIn</button>
      </main>
    )
  }
}

export default Home
