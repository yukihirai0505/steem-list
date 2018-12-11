import sc2 from 'sc2-sdk'

export const isProd = process.env.NODE_ENV === 'production'
export const apiBaseUrl = isProd
  ? 'https://diary.yabaiwebyasan.com/api'
  : 'http://localhost:5000/api'
export const api = sc2.Initialize({
  app: 'yabami',
  callbackURL: 'http://localhost:3000',
  accessToken: 'access_token',
  scope: ['vote', 'comment']
})
