import React, { Component } from 'react'
import SignIn from './pages/SignIn'
import { apiBaseUrl } from './config/app'
import sc2 from 'sc2-sdk'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: undefined,
      result: [],
      api: sc2.Initialize({
        app: 'yabami',
        callbackURL: 'http://localhost:3000',
        accessToken: 'access_token',
        scope: ['vote', 'comment'],
      })
    }
  }

  async componentDidMount() {
    const { user } = this.state
    if (user) {
      const idToken = await user.getIdToken()
      await fetch(`${apiBaseUrl}/users`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          idToken: idToken,
        })
      })
    }
  }

  handleLogin = e => {
    const { api } = this.state
    e.preventDefault()
    window.location.href = api.getLoginURL()
  }

  handleSignOut = () => {
  }

  render() {
    const { user, result } = this.state
    return user ? (
      <p>sign in</p>
    ) : (
      <SignIn handleLogin={this.handleLogin}/>
    )
  }
}

export default App
