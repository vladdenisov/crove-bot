const { default: fetch } = require('node-fetch')

const { lastfm } = require('../../config.json')

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // Максимум не включается, минимум включается
}

const getSimilar = async (name, artist) => {
  if (!artist) { [name, artist] = await search(name).then(res => [res.name, res.artist]) }
  const result = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&track=${ name }&artist=${ artist }&api_key=${ lastfm }&format=json&autocorrect=1`)
    .then(res => res.json())
    .then(res => {
      const max = res.similartracks.track.length
      console.log(res.similartracks.track[0])
      let rand = getRandomInt(0, max < 20 ? max : 20)
      console.log(rand)
      let i = 0
      while (!res.similartracks.track[rand]) {
        if (i > 10) {
          throw new Error()
        }
        rand = getRandomInt(0, max - 10 > 0 ? max - 20 : 0)
        i++
      }
      return {
        name: res.similartracks.track[rand].name,
        artist: res.similartracks.track[rand].artist.name
      }
    })
    .catch(e => console.log(e))
  return result
}

const search = async name => {
  const result = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${ name }&api_key=${ lastfm }&format=json`)
    .then(res => res.json())
    .then(res => {
      return {
        name: res.results.trackmatches.track[0].name,
        artist: res.results.trackmatches.track[0].artist
      }
    })
    .catch(e => console.log(e))
  return result
}

module.exports = { getSimilar, search }
