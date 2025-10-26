const request = require('postman-request')

const geocode = (address, callback) => {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    encodeURIComponent(address) +
    '.json?access_token=pk.eyJ1IjoiYXBpaXAiLCJhIjoiY21oMWNuZG90MHI1bWowcTFheXR6Mnk4diJ9.6F3GeNH3nP50nkAyLXgpGg'

  console.log(`Geocoding request for: ${address}`)
  console.log(`URL: ${url}`)

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      console.error('Geocode error:', error)
      callback('Tidak dapat terkoneksi ke layanan', undefined)
    } else if (response.body.error) {
      console.error('Mapbox API error:', response.body.error)
      callback('Error dari API geocoding: ' + response.body.error.message, undefined)
    } else if (response.body.features.length === 0) {
      console.log('No features found for address:', address)
      callback('Tidak dapat menemukan lokasi. Lakukan pencarian lokasi yang lain', undefined)
    } else {
      console.log('Geocode success:', response.body.features[0].place_name)
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name
      })
    }
  })
}

module.exports = geocode