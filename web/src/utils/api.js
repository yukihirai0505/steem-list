import { Cookie } from './cookie'

const baseUrl = `https://script.google.com/macros/s/AKfycbwpr0c-AU1ANhlmCVk0FkFAcfZWLAMWiZNMwDgRKbMbxzXVInI-/exec`

export const getList = async username => {
  const response = await fetch(`${baseUrl}?action=show-all-list&param=${username}`)
  return await response.json()
}

export const getListMembers = async id => {
  const response = await fetch(`${baseUrl}?action=show-list-member&param=${id}`)
  return await response.json()
}

const postRequest = async (action, params) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({
      action: action,
      accessToken: Cookie.get('auth'),
      params
    })
  })
  return await response.json()
}

export const createList = async listName => {
  return postRequest('create-list', {
    listName
  })
}

export const removeList = async listId => {
  return postRequest('remove-list', {
    listId
  })
}

export const addListMember = async (listId, username) => {
  return postRequest('add-list-member', {
    listId,
    username
  })
}

export const removeListMember = async (listId, username) => {
  return postRequest('remove-list-member', {
    listId,
    username
  })
}
