const bk = SpreadsheetApp.getActiveSpreadsheet()
export const listSheet = bk.getSheetByName('list')
export const listMemberSheet = bk.getSheetByName('list_member')

export const findByListIdAndUserName = (listId, username) => {
  const list = listSheet.getRange(2, 1, listSheet.getLastRow(), 3).getValues()
  for (let i = 0; i < list.length; i += 1) {
    if (list[i][0] === listId && list[i][1] === username) {
      return i
    }
  }
  return undefined
}

export const findListMemberByListIdAndUserName = (listId, username) => {
  const list = listMemberSheet.getRange(2, 1, listMemberSheet.getLastRow(), 3).getValues()
  for (let i = 0; i < list.length; i += 1) {
    if (list[i][0] === listId && list[i][1] === username) {
      return i
    }
  }
  return undefined
}
