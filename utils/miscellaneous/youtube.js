
const getID = url => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : false
}
const getThumbnail = url => `http://i3.ytimg.com/vi/${getID(url)}/maxresdefault.jpg`
module.exports = {
  getID,
  getThumbnail
}
