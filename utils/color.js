const { getColorFromURL } = require('color-thief-node')

// Used to convert rgb(255, 255, 255) to hex #ffffff
exports.rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

/**
 * Get Dominant color from picture
 * @param {string} url Picture URL
 * @return {string} HEX color
 *
 * @example
 *     getDominant("URL HERE")
 *      .then(e => console.log(e))
 *      .catch(err => console.error(err))
 */

exports.getDominant = url => {
  return new Promise((resolve, reject) => {
    (async () => {
      getColorFromURL(url)
        .then(rgb => {
          let hex = `${ this.rgbToHex(...rgb) }`
          resolve(hex)
        })
        .catch(e => {
          reject(e)
          return 0
        })
    })()
  })
}
