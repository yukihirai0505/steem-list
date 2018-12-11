import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Home from './container/Home.js'
import User from './container/User.js'
import GenericNotFound from './container/GenericNotFound.js'
import { api } from './config/app'
import { createList } from './utils/api'
import './Custom.css'
import { Cookie } from './utils/cookie'
import { createBrowserHistory } from 'history'
import Authenticate from './container/Authenticate'

const history = createBrowserHistory()

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
      const accessToken = Cookie.get('auth')
      const res = await api(accessToken).me()
      console.log(await createList('hogehoge'))
      this.setUserInfo(res._id)
    }
  }

  async componentDidMount() {
    /*
   - routing
       - /@username
       - /@username/list-name
       - /@username/list-name/members
   - api
   - show timeline
   - vote & comment to content
     */
    const urlParams = new URLSearchParams(document.location.search)
    const accessToken = urlParams.get('access_token')
    // let expiresIn = urlParams.get('expires_in')
    const username = urlParams.get('username')
    if (accessToken) {
      Cookie.set('auth', accessToken, 1)
      this.setUserInfo(username)
      history.push({
        pathname: `/`
      })
    }
  }

  setUserInfo = username => {
    this.setState({
      username,
      isLogin: true
    })
  }

  handleLogin = e => {
    //e.preventDefault()
    window.location.href = api().getLoginURL()
  }

  handleLogout = e => {
    Cookie.delete('auth')
    this.setState({
      isLogin: false
    })
    history.push({
      pathname: `/`
    })
  }

  render() {
    const { isLogin } = this.state
    return (
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Home {...props} isLogin={isLogin} handleLogin={this.handleLogin}
                                   handleLogout={this.handleLogout}/>}
          />
          <Authenticate>
            <Switch>
              <Route path="/@*" component={User}/>
              <Route component={GenericNotFound}/>
            </Switch>
          </Authenticate>
        </Switch>
      </div>
    )
  }
}

export default App
