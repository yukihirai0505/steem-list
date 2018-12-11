import sc2 from 'sc2-sdk'
import { Cookie } from '../utils/cookie'

export const isProd = process.env.NODE_ENV === 'production'
export const api = sc2.Initialize({
  app: 'yabami',
  callbackURL: 'http://localhost:3000',
  accessToken: Cookie.get('auth'),
  scope: ['vote', 'comment']
})
