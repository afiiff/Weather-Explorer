const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
  const url =
    'http://api.weatherstack.com/current?access_key=f4710d396c989815542673b467c60b4e&query=' +
    encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) +
    '&units=m'

  console.log(`Forecast request for lat: ${latitude}, lon: ${longitude}`)
  console.log(`URL: ${url}`)

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      console.error('Forecast error:', error)
      callback('Tidak dapat terkoneksi ke layanan', undefined)
    } else if (response.body.error) {
      console.error('Weatherstack API error:', response.body.error)
      callback('Error dari API cuaca: ' + response.body.error.info, undefined)
    } else {
      console.log('Forecast success for location')
      // Return structured JSON data instead of plain text
      const weatherData = {
        description: response.body.current.weather_descriptions[0] || 'Unknown',
        temperature: response.body.current.temperature,
        humidity: response.body.current.humidity,
        wind_speed: response.body.current.wind_speed,
        visibility: response.body.current.visibility,
        pressure: response.body.current.pressure,
        uv_index: response.body.current.uv_index,
        feels_like: response.body.current.feelslike,
        weather_code: response.body.current.weather_code
      }
      callback(undefined, weatherData)
    }
  })
}

module.exports = forecast
