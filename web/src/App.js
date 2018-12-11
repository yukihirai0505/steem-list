import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Home from './container/Home.js'
import Article from './container/Article.js'
import User from './container/User.js'
import GenericNotFound from './container/GenericNotFound.js'
import sc2 from 'sc2-sdk'
import './Custom.css'

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
        scope: ['vote', 'comment']
      })
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
    // TODO: access token check
    let accessToken = new URLSearchParams(document.location.search).get(
      'access_token'
    )
    // saveCookie
    console.log(accessToken)
  }

  handleLogin = e => {
    const { api } = this.state
    //e.preventDefault()
    window.location.href = api.getLoginURL()
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/"
                 render={(props) => <Home {...props} handleLogin={this.handleLogin}/>}
          />
          <Route exact path="/article" component={Article}/>
          <Route path='/@*' component={User}/>
          <Route component={GenericNotFound}/>
        </Switch>
      </div>
    )
  }
}

export default App


// handleLogin = e => {
//   const { api } = this.state
//   e.preventDefault()
//   window.location.href = api.getLoginURL()
// }
// createList = async () => {
//   let accessToken = new URLSearchParams(document.location.search).get(
//     'access_token'
//   )
//   console.log(accessToken)
//   await test(accessToken, 'test')
// }
