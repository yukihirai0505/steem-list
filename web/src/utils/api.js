const baseUrl = `https://script.google.com/macros/s/AKfycbwpr0c-AU1ANhlmCVk0FkFAcfZWLAMWiZNMwDgRKbMbxzXVInI-/exec`

export const test = async (accessToken, listName) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      body: JSON.stringify({
        action: 'create-list',
        params: {
          accessToken,
          listName
        }
      })
    }
  })
  console.log(response)
}
