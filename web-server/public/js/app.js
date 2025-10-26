const weatherForm = document.querySelector('.search-form')
const searchInput = document.querySelector('#location-input')
const cityName = document.querySelector('#city-name')
const cityHighlight = document.querySelector('#city-highlight')
const temperature = document.querySelector('#temperature')
const weatherIcon = document.querySelector('#weather-icon')
const humidity = document.querySelector('#humidity')
const windSpeed = document.querySelector('#wind-speed')
const visibility = document.querySelector('#visibility')
const humidityDetail = document.querySelector('#humidity-detail')
const windDetail = document.querySelector('#wind-detail')
const visibilityDetail = document.querySelector('#visibility-detail')
const pressure = document.querySelector('#pressure')
const errorMessage = document.querySelector('#error-message')
const cityButtons = document.querySelectorAll('.city-btn')

// Weather icon mapping based on conditions
const weatherIcons = {
    'clear': 'fas fa-sun',
    'sunny': 'fas fa-sun',
    'partly cloudy': 'fas fa-cloud-sun',
    'cloudy': 'fas fa-cloud',
    'overcast': 'fas fa-cloud',
    'rain': 'fas fa-cloud-rain',
    'light rain': 'fas fa-cloud-rain',
    'moderate rain': 'fas fa-cloud-showers-heavy',
    'heavy rain': 'fas fa-cloud-showers-heavy',
    'thunderstorm': 'fas fa-bolt',
    'snow': 'fas fa-snowflake',
    'mist': 'fas fa-smog',
    'fog': 'fas fa-smog'
}

function updateWeatherDisplay(data) {
    // Update main weather card
    cityName.textContent = data.location || 'Unknown Location'
    temperature.textContent = data.temperature ? `${data.temperature}°C` : '--°C'
    cityHighlight.textContent = data.description || 'Weather data unavailable'

    // Set weather icon
    const condition = (data.description || '').toLowerCase()
    let iconClass = 'fas fa-cloud-sun' // default
    for (const [key, value] of Object.entries(weatherIcons)) {
        if (condition.includes(key)) {
            iconClass = value
            break
        }
    }
    weatherIcon.className = `weather-icon ${iconClass}`

    // Update details
    humidity.textContent = data.humidity ? `${data.humidity}%` : '--%'
    windSpeed.textContent = data.wind_speed ? `${data.wind_speed} km/h` : '-- km/h'
    visibility.textContent = data.visibility ? `${data.visibility} km` : '-- km'

    // Update side panel details
    humidityDetail.textContent = data.humidity ? `${data.humidity}%` : '--%'
    windDetail.textContent = data.wind_speed ? `${data.wind_speed} km/h` : '-- km/h'
    visibilityDetail.textContent = data.visibility ? `${data.visibility} km` : '-- km'
    pressure.textContent = data.pressure ? `${data.pressure} hPa` : '-- hPa'

    // Hide error message
    errorMessage.style.display = 'none'
}

function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = 'block'
    // Reset weather display
    cityName.textContent = 'City'
    temperature.textContent = '--°C'
    cityHighlight.textContent = 'Weather unavailable'
    weatherIcon.className = 'weather-icon fas fa-question'
    humidity.textContent = '--%'
    windSpeed.textContent = '-- km/h'
    visibility.textContent = '-- km'
    humidityDetail.textContent = '--%'
    windDetail.textContent = '-- km/h'
    visibilityDetail.textContent = '-- km'
    pressure.textContent = '-- hPa'
}

async function fetchWeather(location) {
    try {
        const response = await fetch('/infoCuaca?address=' + encodeURIComponent(location))
        const data = await response.json()

        if (data.error) {
            showError(data.error)
        } else {
            // Use the structured weather data from backend
            const weatherData = {
                location: data.lokasi,
                temperature: data.weatherData.temperature,
                description: data.weatherData.description,
                humidity: data.weatherData.humidity,
                wind_speed: data.weatherData.wind_speed,
                visibility: data.weatherData.visibility,
                pressure: data.weatherData.pressure
            }
            updateWeatherDisplay(weatherData)
        }
    } catch (error) {
        showError('Unable to fetch weather data. Please try again.')
    }
}

function parseWeatherData(prediksiCuaca, lokasi) {
    // This function parses the weather prediction string and returns structured data
    // Since the exact format of prediksiCuaca is unknown, we'll make assumptions
    // In a real scenario, you'd modify the backend to return JSON with structured data

    let temperature = null
    let description = 'Partly cloudy'
    let humidity = null
    let wind_speed = null
    let visibility = null
    let pressure = null

    // Try to extract temperature (assuming format like "24°C" or "Temperature: 24°C")
    const tempMatch = prediksiCuaca.match(/(\d+)°C/i) || prediksiCuaca.match(/temperature[:\s]*(\d+)/i)
    if (tempMatch) {
        temperature = parseInt(tempMatch[1])
    }

    // Try to extract humidity
    const humidityMatch = prediksiCuaca.match(/humidity[:\s]*(\d+)%/i)
    if (humidityMatch) {
        humidity = parseInt(humidityMatch[1])
    }

    // Try to extract wind speed
    const windMatch = prediksiCuaca.match(/wind[:\s]*(\d+)\s*km\/h/i)
    if (windMatch) {
        wind_speed = parseInt(windMatch[1])
    }

    // Try to extract visibility
    const visibilityMatch = prediksiCuaca.match(/visibility[:\s]*(\d+)\s*km/i)
    if (visibilityMatch) {
        visibility = parseInt(visibilityMatch[1])
    }

    // Try to extract pressure
    const pressureMatch = prediksiCuaca.match(/pressure[:\s]*(\d+)\s*hPa/i)
    if (pressureMatch) {
        pressure = parseInt(pressureMatch[1])
    }

    // Determine description from text
    if (prediksiCuaca.toLowerCase().includes('rain')) {
        description = 'Rainy'
    } else if (prediksiCuaca.toLowerCase().includes('sun')) {
        description = 'Sunny'
    } else if (prediksiCuaca.toLowerCase().includes('cloud')) {
        description = 'Cloudy'
    }

    return {
        location: lokasi,
        temperature,
        description,
        humidity,
        wind_speed,
        visibility,
        pressure
    }
}

// Form submission
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = searchInput.value.trim()
    if (location) {
        fetchWeather(location)
    } else {
        showError('Please enter a city name')
    }
})

// Popular city buttons
cityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const city = button.getAttribute('data-city')
        searchInput.value = city
        fetchWeather(city)
    })
})

// Load default weather on page load (optional)
document.addEventListener('DOMContentLoaded', () => {
    // You can load weather for a default city here if desired
    // fetchWeather('Jakarta')
})
