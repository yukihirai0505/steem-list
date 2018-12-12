import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getList, removeList, createList } from '../utils/api'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string,
    isLogin: PropTypes.bool
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
    const { isLogin, username } = this.props
    if (!doneFirstFetchList && username) {
      this.fetchList()
    }
    return (
      <main>
        {isLogin && (
          <div>
            <form action="#" onSubmit={e => this.createList(e)}>
              New List Name:{' '}
              <input
                type="text"
                value={newListName}
                onChange={e => this.handleListNameChange(e)}
              />
              <input type="submit" value="create"/>
            </form>
            <div className='content-main'>
              <div className='list-heading'>
                <div className='list-heading-content'>
                  <h2 className="list-heading-title">Lists</h2>
                </div>
              </div>
              <div className='list'>
                <div className='list-items'>
                  {list.map((row, key) => {
                    const listId = row[0]
                    const username = row[1]
                    const listName = row[2]
                    return (
                      <div key={listId} className='grid'>
                        <div className='grid-cell'>
                          <div className='list-item'>
                           <span className='list-item-name'>
                            <Link to={`/${username}/${listId}`}>{listName} </Link>
                             </span>
                            <a href="" onClick={e => this.removeList(e, listId)}>
                              x
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }
}

export default withRouter(Home)
