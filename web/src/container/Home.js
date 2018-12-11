import React, { Component, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Cookie } from '../utils/cookie'
import { api } from '../config/app'
import { getList, removeList, createList } from '../utils/api'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string,
    isLogin: PropTypes.bool,
    handleLogin: PropTypes.any,
    handleLogout: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      newListName: ''
    }
  }

  async setList() {
    const { list } = this.state
    const { username } = this.props
    if (username && list.length === 0) {
      this.setState({
        list: (await getList(username)).data
      })
    }
  }

  handleListNameChange(e) {
    this.setState({ newListName: e.target.value })
  }

  clearList() {
    this.setState({
      list: []
    })
  }

  async createList(e) {
    e.preventDefault()
    const { newListName } = this.state
    await createList(newListName)
    this.clearList()
  }

  async removeList(listId) {
    console.log(listId)
    await removeList(listId)
    this.clearList()
  }

  render() {
    const { list, newListName } = this.state
    const { isLogin, handleLogin, handleLogout } = this.props
    this.setList()
    return (
      <main>
        <h1>Steem List</h1>
        {isLogin ?
          <div>
            <button onClick={() => handleLogout()}>Logout</button>
            <form action="#" onSubmit={e => this.createList(e)}>
              New List Name: <input type="text" value={newListName} onChange={e => this.handleListNameChange(e)}/>
              <input type="submit" value="create"/>
            </form>
            <p>Your List</p>
            <ul>
              {list.map((row, key) => {
                const listId = row[0]
                const listName = row[2]
                return (
                  <li key={listId}>{listName} <a href='#' onClick={() => this.removeList(listId)}>x</a></li>
                )
              })}
            </ul>
          </div> :
          <button onClick={() => handleLogin()}>SignIn</button>
        }
      </main>
    )
  }
}

export default Home
