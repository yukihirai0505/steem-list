import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Cookie } from '../utils/cookie'
import { api } from '../config/app'
import { getListMembers } from '../utils/api'

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timeline: [],
      members: []
    }
  }

  async componentDidMount() {
    const { location, match } = this.props
    const { name, listId } = match.params
    if (listId) {
      this.setState({
        members: (await getListMembers(listId)).data
      })
    }
  }

  render() {
    const { members } = this.state
    /*
  - routing
  - /@username/list-name show timeline & if loginUser is @username => show add/remove member btn
  - /@username/list-name/members show list members if loginUser is @username => remove member btn
  */
    return (
      <main>
        <h1>yay</h1>
        <p>List Members</p>
        <ul>
          {members.map((member, key) => {
            const listId = member[0]
            const username = member[1]
            return (
              <li key={key}>{username}</li>
            )
          })}
        </ul>
      </main>
    )
  }
}

export default withRouter(List)
