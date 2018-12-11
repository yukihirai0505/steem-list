import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Home extends Component {
  static propTypes = {
    isLogin: PropTypes.bool,
    handleLogin: PropTypes.any,
    handleLogout: PropTypes.any
  }

  render() {
    const { isLogin, handleLogin, handleLogout } = this.props
    return (
      <main>
        <h1>Steem List</h1>
        {isLogin ?
          <button onClick={() => handleLogout()}>Logout</button> :
          <button onClick={() => handleLogin()}>SignIn</button>
        }
      </main>
    )
  }
}

export default Home
