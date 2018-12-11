import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getList, removeList, createList } from '../utils/api'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

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
      newListName: '',
      doneFirstFetchList: false
    }
  }

  async componentDidMount() {
    await this.fetchList()
  }

  async fetchList() {
    const { doneFirstFetchList } = this.state
    const { username } = this.props
    if (username) {
      this.setState({
        list: (await getList(username)).data
      })
      if (!doneFirstFetchList) {
        this.setState({
          doneFirstFetchList: true
        })
      }
    }
  }

  handleListNameChange(e) {
    this.setState({ newListName: e.target.value })
  }


  async createList(e) {
    e.preventDefault()
    const { newListName } = this.state
    await createList(newListName)
    await this.fetchList()
  }

  async removeList(e, listId) {
    e.preventDefault()
    await removeList(listId)
    await this.fetchList()
  }

  render() {
    const { list, newListName, doneFirstFetchList } = this.state
    const { isLogin, handleLogin, handleLogout, username } = this.props
    if (!doneFirstFetchList && username) {
      this.fetchList()
    }
    return (
      <main>
        <h1>Steem List</h1>
        {isLogin ? (
          <div>
            <button onClick={() => handleLogout()}>Logout</button>
            <form action="#" onSubmit={e => this.createList(e)}>
              New List Name:{' '}
              <input
                type="text"
                value={newListName}
                onChange={e => this.handleListNameChange(e)}
              />
              <input type="submit" value="create"/>
            </form>
            <p>Your List</p>
            <ul>
              {list.map((row, key) => {
                const listId = row[0]
                const username = row[1]
                const listName = row[2]
                return (
                  <li key={listId}>
                    <Link to={`/${username}/${listId}`}>{listName}{' '}</Link>
                    <a href="" onClick={(e) => this.removeList(e, listId)}>
                      x
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <button onClick={() => handleLogin()}>SignIn</button>
        )}
      </main>
    )
  }
}

export default withRouter(Home)
