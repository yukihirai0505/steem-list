import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Cookie } from '../utils/cookie'
import { api } from '../config/app'
import { getListMembers, addListMember, removeListMember } from '../utils/api'

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timeline: [],
      members: [],
      newMemberName: ''
    }
  }

  async componentDidMount() {
    await this.fetchMembers()
  }

  async fetchMembers() {
    const { location, match } = this.props
    const { name, listId } = match.params
    if (listId) {
      this.setState({
        members: (await getListMembers(listId)).data
      })
    }
  }

  async addListMember(e) {
    e.preventDefault()
    const { newMemberName } = this.state
    const { match } = this.props
    const { listId } = match.params
    await addListMember(listId, `@${newMemberName}`)
    await this.fetchMembers()
  }

  async removeListMember(username) {
    const { match } = this.props
    const { listId } = match.params
    await removeListMember(listId, username)
    await this.fetchMembers()
  }

  handleMemberNameChange(e) {
    this.setState({ newMemberName: e.target.value })
  }

  render() {
    const { members, newMemberName } = this.state
    return (
      <main>
        <h1>yay</h1>
        <p>List Members</p>
        <form action="#" onSubmit={e => this.addListMember(e)}>
          Add Member:{' '}
          @<input
          type="text"
          value={newMemberName}
          onChange={e => this.handleMemberNameChange(e)}
        />
          <input type="submit" value="create"/>
        </form>
        <ul>
          {members.map((member, key) => {
            const listId = member[0]
            const username = member[1]
            return (
              <li key={key}>{username} <a onClick={() => this.removeListMember(username)}>x</a></li>
            )
          })}
        </ul>
      </main>
    )
  }
}

export default withRouter(List)
