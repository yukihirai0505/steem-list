import sc2 from 'sc2-sdk'

export const isProd = process.env.NODE_ENV === 'production'
export const api = accessToken => sc2.Initialize({
  app: 'yabami',
  callbackURL: 'http://localhost:3000',
  accessToken,
  scope: ['vote', 'comment']
})
