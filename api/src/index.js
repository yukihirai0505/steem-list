import { sha256, createResponse, userInfo } from './util'
import {
  listSheet,
  listMemberSheet,
  findByListIdAndUserName,
  findListMemberByListIdAndUserName
} from './sheet'

global.doGet = e => {
  const { action, param } = e.parameter
  let response = {}
  switch (action) {
    case 'show-all-list': {
      response = listSheet
        .getRange(2, 1, listSheet.getLastRow(), 3)
        .getValues()
        .filter(data => data[1] === param)
      break
    }
    case 'show-list-member': {
      response = listMemberSheet
        .getRange(2, 1, listMemberSheet.getLastRow(), 3)
        .getValues()
        .filter(data => data[0] === param)
      break
    }
    default:
      break
  }
  return createResponse(response)
}

global.doPost = e => {
  let response = {}
  try {
    const data = JSON.parse(e.postData.getDataAsString())
    const { action, accessToken, params } = data
    const loginUser = userInfo(accessToken)

    switch (action) {
      case 'create-list': {
        const { listName } = params
        const id = sha256(`${loginUser}${listName}${new Date().getTime()}`)
        listSheet.appendRow([id, loginUser, listName])
        response = userInfo
        break
      }
      case 'remove-list': {
        const { listId } = params
        const listIndex = findByListIdAndUserName(listId, loginUser)
        if (listIndex !== undefined) {
          listSheet.deleteRow(listIndex + 2)
        }
        break
      }
      case 'add-list-member': {
        const { listId, username } = params
        const listIndex = findByListIdAndUserName(listId, loginUser)
        if (listIndex) {
          listMemberSheet.appendRow([listId, username])
        }
        break
      }
      case 'remove-list-member': {
        const { listId, username } = params
        const listIndex = findByListIdAndUserName(listId, loginUser)
        if (listIndex) {
          const listMemberIndex = findListMemberByListIdAndUserName(listId, username)
          if (listMemberIndex !== undefined) {
            listMemberSheet.deleteRow(listMemberIndex + 2)
          }
        }
        break
      }
      default: {
        break
      }
    }
  } catch (err) {
    response = {
      errMessage: err.message
    }
  }
  return createResponse(response)
}
