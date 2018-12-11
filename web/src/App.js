import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './container/Home.js'
import User from './container/User.js'
import List from './container/List.js'
import GenericNotFound from './container/GenericNotFound.js'
import { productBaseUrl, api } from './config/app'
import './Custom.css'
import { Cookie } from './utils/cookie'
import Authenticate from './container/Authenticate'
import { withRouter } from 'react-router'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: undefined,
      isLogin: Cookie.get('auth') !== null
    }
  }

  async componentWillMount() {
    const { username, isLogin } = this.state
    if (!username && isLogin) {
      const res = await api.me()
      this.setUserInfo(res._id)
    }
  }

  async componentDidMount() {
    const urlParams = new URLSearchParams(document.location.search)
    const accessToken = urlParams.get('access_token')
    // let expiresIn = urlParams.get('expires_in')
    const username = urlParams.get('username')
    if (accessToken) {
      Cookie.set('auth', accessToken, 1)
      this.setUserInfo(username)
      window.location.href = productBaseUrl
    }
  }

  setUserInfo = username => {
    this.setState({
      username: `@${username}`,
      isLogin: true
    })
  }

  handleLogin = e => {
    window.location.href = api.getLoginURL()
  }

  handleLogout = e => {
    const { history } = this.props
    Cookie.delete('auth')
    this.setState({
      isLogin: false
    })
    window.location.href = productBaseUrl
  }

  render() {
    const { username, isLogin } = this.state
    return (
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <Home
                {...props}
                isLogin={isLogin}
                username={username}
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
              />
            )}
          />
          <Authenticate>
            <Switch>
              <Route
                path="/:name(@[a-zA-Z0-9-_\.]+)/:listId"
                component={List}
              />
              <Route path="/:name(@[a-zA-Z0-9-_\.]+)" component={User} />
              <Route component={GenericNotFound} />
            </Switch>
          </Authenticate>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)
