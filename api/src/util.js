export const sha256 = s => {
  let hexstr = ''
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s)
  for (let i = 0; i < digest.length; i += 1) {
    const val = (digest[i] + 256) % 256
    hexstr += `0${val.toString(16)}`.slice(-2)
  }
  return hexstr
}

export const createResponse = data => {
  const output = ContentService.createTextOutput()
  output.setMimeType(ContentService.MimeType.JSON)
  if (data) {
    output.setContent(
      JSON.stringify({
        data
      })
    )
  }
  return output
}

export const userInfo = accessToken => {
  const { _id: steemUserId } = JSON.parse(
    UrlFetchApp.fetch('https://steemconnect.com/api/me', {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: accessToken
      }
    }).getContentText()
  )
  return `@${steemUserId}`
}
