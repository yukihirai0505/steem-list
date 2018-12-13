import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { productBaseUrl } from '../config/app'

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
              <div role='navigation' style={{ display: 'inline-block' }}>
                <ul className='nav' id='global-actions'>
                  <li id="global-nav-home" className="home active new" data-global-action="home">
                    <a className="js-nav js-tooltip js-dynamic-tooltip" data-placement="bottom" href={productBaseUrl}>
                      <i className="fa fa-home"/>
                      <span className="text" aria-hidden="true">Home</span>
                    </a>
                  </li>
                </ul>
              </div>
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
