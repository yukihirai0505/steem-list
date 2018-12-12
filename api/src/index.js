import { sha256, createResponse, userInfo } from './util'
import {
  listSheet,
  listMemberSheet,
  findByListIdAndUserName,
  findListMemberByListIdAndUserName
} from './sheet'

global.doGet = e => {
  const { action } = e.parameter
  let response = {}
  switch (action) {
    case 'show-all-list': {
      const { username } = e.parameter
      response = listSheet
        .getRange(2, 1, listSheet.getLastRow(), 3)
        .getValues()
        .filter(data => data[1] === username)
      break
    }
    case 'show-list-member': {
      const { username, listId } = e.parameter
      const listIndex = findByListIdAndUserName(listId, username)
      if (listIndex !== undefined) {
        const list = listSheet.getRange(listIndex + 2, 1, 1, 3).getValues()[0]
        response = {
          list: {
            username: list[1],
            name: list[2]
          },
          members: listMemberSheet
            .getRange(2, 1, listMemberSheet.getLastRow(), 3)
            .getValues()
            .filter(data => data[0] === listId)
        }
      }
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
          listMemberSheet
            .getRange(2, 1, listMemberSheet.getLastRow(), 3)
            .getValues()
            .forEach((member, i) => {
              if (member[0] === listId) {
                listMemberSheet.deleteRow(i + 2)
              }
            })
        }
        break
      }
      case 'add-list-member': {
        const { listId, username } = params
        const listIndex = findByListIdAndUserName(listId, loginUser)
        if (listIndex !== undefined) {
          listMemberSheet.appendRow([listId, username])
          response = { result: true }
        } else {
          params.loginUser = loginUser
          response = {
            result: false,
            params
          }
        }
        break
      }
      case 'remove-list-member': {
        const { listId, username } = params
        const listIndex = findByListIdAndUserName(listId, loginUser)
        if (listIndex !== undefined) {
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
