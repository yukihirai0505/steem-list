import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getListMembers, addListMember, removeListMember } from '../utils/api'
import { Client } from 'dsteem'
import { Cookie } from '../utils/cookie'
import { api } from '../config/app'

const client = new Client('https://api.steemit.com')

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timeline: [],
      members: [],
      newMemberName: '',
      username: undefined,
      isLogin: Cookie.get('auth') !== null
    }
  }

  async componentWillMount() {
    const { username, isLogin } = this.state
    if (!username && isLogin) {
      const res = await api.me()
      this.setState({
        username: `@${res._id}`,
        isLogin: true
      })
    }
  }

  async componentDidMount() {
    await this.fetchMembers()
  }

  async fetchMembers() {
    const { location, match } = this.props
    const { name, listId } = match.params
    if (listId) {
      const members = (await getListMembers(name, listId)).data
      if (Array.isArray(members)) {
        this.setState({
          members
        })
      }
    }
    await this.fetchTimeline()
  }

  async fetchTimeline() {
    const { members } = this.state
    members.forEach(async member => {
      const query = {
        tag: member[1].replace('@', ''),
        limit: 10
      }
      const result = await client.database
        .getDiscussions('blog', query)
      const { timeline } = this.state
      this.setState({
        timeline: timeline.concat(result).sort((a, b) => {
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        })
      })
    })
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
    const { username, members, newMemberName, timeline } = this.state
    const { match } = this.props
    const { name } = match.params
    const isMe = name === username
    return (
      <main>
        <p>List Members</p>
        {isMe &&
        <form action="#" onSubmit={e => this.addListMember(e)}>
          Add Member:{' '}
          @<input
          type="text"
          value={newMemberName}
          onChange={e => this.handleMemberNameChange(e)}
        />
          <input type="submit" value="create"/>
        </form>
        }
        <ul>
          {members.map((member, key) => {
            const listId = member[0]
            const username = member[1]
            return (
              <li key={key}>{username} {isMe && <a onClick={() => this.removeListMember(username)}>x</a>}</li>
            )
          })}
        </ul>
        <p>Timeline</p>
        <ul>
          {timeline.map((post, key) => {
            /**
             const json = JSON.parse(post.json_metadata);
             const image = json.image ? json.image[0] : '';
             */
            console.log(post)
            return (
              <li key={key}>{post.title} by {post.author} @{new Date(post.created).toDateString()}</li>
            )
          })}
        </ul>
      </main>
    )
  }
}

export default withRouter(List)
