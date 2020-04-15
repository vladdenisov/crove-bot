// My anime list minimal API using jiikan.moe
const fetch = require('node-fetch')

/**
 * MAL search by query
 * @param {string} query Search query
 * @param {number} [_limit] List length
 * @return {Array} Results array
 *
 * @example
 *     search("kimi no na wa", 1)
 *      .then(e => console.log(e[0]))
 *      .catch(err => console.error(err))
 */

exports.search = (query, _limit = 1) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.jikan.moe/v3/search/anime?q=${ query }&limit=${ _limit }`)
      .then(res => res.json())
      .then(response => {
        resolve(response.results)
      })
      .catch(e => {
        reject(e)
        return 0
      })
  })
}
