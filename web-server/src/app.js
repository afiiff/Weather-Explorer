const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { title } = require('process')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const getNews = require('./utils/news')  // <-- TAMBAHAN

const app = express()

// Mendefinisikan jalur/path untuk konfigurasi Express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)
hbs.registerHelper('eq', function (a, b) {
  return a === b
})

// setup direktori statis
app.use(express.static(direktoriPublic))

// ini halaman utama
app.get('', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Afiif Alfarabi'
  })
})

// ini halaman bantuan
app.get('/bantuan', (req, res) => {
  res.render('bantuan', {
    judul: 'Bantuan saya',
    nama: 'Afiif Alfarabi',
    teksBantuan: 'ini adalah teks bantuan',
    title: 'Bantuan Aplikasi Cek Cuaca'
  })
})

// ini infocuaca
app.get('/infoCuaca', (req, res) => {
  if (!req.query.address) {
    console.log('No address provided in query')
    return res.send({
      error: 'Kamu harus memasukan lokasi yang ingin dicari'
    })
  }

  console.log(`Weather request for address: ${req.query.address}`)

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      console.error('Geocode failed:', error)
      return res.send({ error })
    }

    console.log(`Geocode success: ${location} (${latitude}, ${longitude})`)

    forecast(latitude, longitude, (error, weatherData) => {
      if (error) {
        console.error('Forecast failed:', error)
        return res.send({ error })
      }

      console.log('Weather data retrieved successfully')
      res.send({
        weatherData,
        lokasi: location,
        address: req.query.address
      })
    })
  })
})

// ====== BERITA (BARU) ======
app.get('/berita', (req, res) => {
  const q = (req.query.q || '').trim()
  const country = (req.query.country || '').trim() // contoh: 'us' | 'id' | ''

  getNews({ q, countries: country || undefined, limit: 12 }, (error, articles = []) => {
    if (error) {
      return res.render('berita', {
        judul: 'Berita',
        nama: 'Afiif Alfarabi',
        error,
        q,
        country,
        articles: []
      })
    }

    res.render('berita', {
      judul: 'Berita',
      nama: 'Afiif Alfarabi',
      q,
      country,
      articles
    })
  })
})
// ====== END BERITA ======

// ini tentang
app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang Saya',
    nama: 'Afiif Alfarabi',
    title: 'Tentang Aplikasi Cek Cuaca'
  })
})

app.get('/bantuan/*', (req, res) => {
  res.render('404', {
    judul: '404',
    nama: 'Afiif Alfarabi',
    pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    judul: '404',
    nama: 'Afiif Alfarabi',
    pesanKesalahan: 'Halaman tidak ditemukan.'
  })
})

app.listen(4000, () => {
  console.log('Server berjalan pada port 4000.')
})
