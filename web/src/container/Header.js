import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class Header extends Component {
  static propTypes = {
    username: PropTypes.string,
    isLogin: PropTypes.bool,
    handleLogin: PropTypes.any,
    handleLogout: PropTypes.any
  }

  render() {
    const { isLogin, handleLogin, handleLogout, username } = this.props
    return (
      <header className='toolbar'>
        <div className='global-nav'>
          <div className='global-nav-inner'>
            <div className='container'>
              <div className='pull-right nav-extras'>
                <ul className='nav right-actions'>
                  {isLogin ?
                    <Fragment>
                      <li>{username}</li>
                      <li>
                        <button className='btn primary' onClick={() => handleLogout()}>Logout</button>
                      </li>
                    </Fragment>
                    : <li>
                      <button className='btn primary' onClick={() => handleLogin()}>SignIn</button>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(Header)
