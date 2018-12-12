import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getListMembers, addListMember, removeListMember } from '../utils/api'
import { Client } from 'dsteem'
import { Cookie } from '../utils/cookie'
import { api } from '../config/app'
import ReactMarkdown from 'react-markdown'

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
    this.setState({
      timeline: []
    })
    members.forEach(async member => {
      const query = {
        tag: member[1].replace('@', ''),
        limit: 10
      }
      const result = await client.database.getDiscussions('blog', query)
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
    const { history, match } = this.props
    const { name } = match.params
    const isMe = name === username
    return (
      <main>
        {isMe && (
          <form action="#" onSubmit={e => this.addListMember(e)}>
            Add Member: @
            <input
              type="text"
              value={newMemberName}
              onChange={e => this.handleMemberNameChange(e)}
            />
            <input type="submit" value="add"/>
          </form>
        )}
        {members.map((member, key) => {
          const listId = member[0]
          const username = member[1]
          return (
            <span key={key}>
                {' '}{username}{' '}
              {isMe && (
                [<a onClick={() => this.removeListMember(username)}>x</a>]
              )}
              </span>
          )
        })}
        <div className='content-main'>
          <div className='content-header'>
            <div className='header-inner'>
              <h2 id="content-main-heading">Timeline</h2>
            </div>
          </div>
          <div className='stream-container'>
            <div className='stream'>
              <ol className='stream-items'>
                {timeline.map((post, key) => {
                  const json = JSON.parse(post.json_metadata)
                  const image = json.image ? json.image[0] : ''
                  console.log(post)
                  return (
                    <li key={key} className='stream-item'>
                      <div className='post'>
                        <div className='context'/>
                        <div className='content'>
                          <div className='stream-item-header'>
                            <a href={`https://steemit.com/@${post.author}`} className='account-group' target='_blank'>
                              <img src={`https://steemitimages.com/u/${post.author}/avatar`}
                                   alt="" className='avatar'/>
                              <span className='username'>
                                <strong className='fullname'>{post.author}</strong>
                              </span>
                            </a>
                            <div className='time'>{new Date(post.created).toDateString()}</div>
                          </div>
                          <div
                            onClick={() => window.open(`https://steemit.com${post.url}`)}>
                            <div className='title'>{post.title}</div>
                            <ReactMarkdown source={`${post.body.slice(0, 500)}...`} skipHtml={true}
                                           disallowedTypes={['image', 'link', 'heading', 'strong', 'break']}
                                           unwrapDisallowed={true}/>
                            <div className='media-container'>
                              <div className='adaptive-media is-square'>
                                <img src={image} alt=""/>
                              </div>
                            </div>
                          </div>
                          <div className='stream-item-footer'>
                            <div className='post-action-list'>
                              <div className='post-action'>
                                <button className='post-action-btn'>
                                  <span
                                    className='post-action-count'>
                                    $ {(roundSBD(post.curator_payout_value) + roundSBD(post.total_payout_value) + roundSBD(post.pending_payout_value)).toFixed(2)}
                                  </span>
                                </button>
                              </div>
                              <div className='post-action'>
                                <button className='post-action-btn'>
                                  <i className="fa fa-chevron-up"/>
                                  <span
                                    className='post-action-count'>
                                    {post.active_votes.length}
                                  </span>
                                </button>
                              </div>
                              <div className='post-action'>
                                <button className='post-action-btn'>
                                  <i className="fa fa-comments"/>
                                  <span
                                    className='post-action-count'>
                                    {post.replies.length}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

function roundSBD(value) {
  return (Math.round(value.replace('SBD', '') * 100) / 100)
}

export default withRouter(List)
