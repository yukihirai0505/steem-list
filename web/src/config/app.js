import sc2 from 'sc2-sdk'
import { Cookie } from '../utils/cookie'

export const isProd = process.env.NODE_ENV === 'production'
export const productBaseUrl = isProd
  ? 'https://yukihirai0505.github.io/steem-list/'
  : 'http://localhost:3000'
export const api = sc2.Initialize({
  app: 'yabami',
  callbackURL: productBaseUrl,
  accessToken: Cookie.get('auth'),
  scope: ['vote', 'comment']
})
