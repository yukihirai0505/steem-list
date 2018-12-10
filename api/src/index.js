const bk = SpreadsheetApp.getActiveSpreadsheet()
const listSheet = bk.getSheetByName('list')
const listMemberSheet = bk.getSheetByName('list_member')

const createResponse = data => {
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

const sha256 = s => {
  let hexstr = ''
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s)
  for (let i = 0; i < digest.length; i += 1) {
    const val = (digest[i] + 256) % 256
    hexstr += `0${val.toString(16)}`.slice(-2)
  }
  return hexstr
}

global.doGet = e => {
  const { action, params } = e.parameter
  let response = {}
  switch (action) {
    case 'show-all-list': {
      const allList = listSheet
        .getRange(2, 1, listSheet.getLastRow(), 3)
        .getValues()
        .filter(data => data[1] === params.username)
      response = allList.length === 1 ? allList[0] : undefined
      break
    }
    case 'show-list-member': {
      response = listMemberSheet
        .getRange(2, 1, listMemberSheet.getLastRow(), 3)
        .getValues()
        .filter(data => data[0] === params.id)
      break
    }
    default:
      break
  }
  return createResponse(response)
}

global.doPost = e => {
  const data = JSON.parse(e.postData.getDataAsString())
  const { action, params } = data
  let response = {}
  switch (action) {
    case 'create-list': {
      const { accessToken, listName } = params
      const userInfo = JSON.parse(
        UrlFetchApp.fetch('https://steemconnect.com/api/me', {
          method: 'post',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: accessToken
          }
        }).getContentText()
      )
      const username = 'username'
      // ID(username+listname+timestamp)
      const id = sha256(`${username}${listName}${new Date().getTime()}`)
      listSheet.appendRow([id, username, listName])
      // listSheet.getRange(2, 1, listSheet.getLastRow(), 3).getValues()
      Logger.log(userInfo)
      response = userInfo
      break
    }
    case 'remove-list': {
      // TODO: 本人チェック
      const { id } = params
      const findList = list => {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i][0] === id) {
            return i
          }
        }
        return undefined
      }
      const listIndex = findList(listSheet.getRange(2, 1, listSheet.getLastRow(), 3).getValues())
      if (listIndex !== undefined) {
        listSheet.deleteRow(listIndex + 2)
      }
      break
    }
    case 'add-list-member': {
      // TODO: 本人チェック
      const { id, username } = params
      listMemberSheet.appendRow([id, username])
      break
    }
    case 'remove-list-member': {
      // TODO: 本人チェック
      const { id, username } = params
      const findListMember = list => {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i][0] === id && list[i][1] === username) {
            return i
          }
        }
        return undefined
      }
      const listMemberIndex = findListMember(
        listMemberSheet.getRange(2, 1, listMemberSheet.getLastRow(), 3).getValues()
      )
      if (listMemberIndex !== undefined) {
        listMemberSheet.deleteRow(listMemberIndex + 2)
      }
      break
    }
    default: {
      break
    }
  }
  return createResponse(response)
}
