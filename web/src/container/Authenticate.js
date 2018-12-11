import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import { api } from '../config/app'
import { Cookie } from '../utils/cookie'

class Authenticate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: Cookie.get('auth') !== null
    }
  }

  render() {
    const { isLogin } = this.state
    return isLogin ? (
      <Route children={this.props.children}/>
    ) : (
      (window.location = api().getLoginURL())
    )
  }
}

export default withRouter(Authenticate)
