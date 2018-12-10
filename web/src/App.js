import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import Featured from './container/Featured.js'
import About from './container/About.js'
import Article from './container/Article.js'
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
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Featured}/>
        <Route exact path="/about" component={About}/>
        <Route exact path="/article" component={Article}/>
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
