import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Home from './container/Home.js'
import User from './container/User.js'
import GenericNotFound from './container/GenericNotFound.js'
import { api } from './config/app'
import './Custom.css'
import { Cookie } from './utils/cookie'
import { createBrowserHistory } from 'history'
import Authenticate from './container/Authenticate'

const history = createBrowserHistory()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: undefined,
      result: [],
      isLogin: Cookie.get('auth') !== null
    }
  }

  async componentDidMount() {
    // const { api } = this.state
    // const res = await api.me
    // console.log(JSON.stringify(res))
    /*
   - gatsby
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
      this.setState({ isLogin: true })
      history.push({
        pathname: `/@${username}`
      })
    }
  }

  handleLogin = e => {
    //e.preventDefault()
    window.location.href = api.getLoginURL()
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Home {...props} handleLogin={this.handleLogin}/>}
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
