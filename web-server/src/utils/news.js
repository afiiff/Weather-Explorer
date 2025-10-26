const request = require('postman-request')

// === GANTI DI SINI ===
const MEDIASTACK_KEY = 'a155a3f9993dc3eea210d6d53c1117f8'

const getNews = (options, callback) => {
  if (!MEDIASTACK_KEY) return callback('MEDIASTACK_KEY belum diisi', undefined)

  const base = 'http://api.mediastack.com/v1/news'
  const params = new URLSearchParams({
    access_key: MEDIASTACK_KEY,
    languages: 'en',
    sort: 'published_desc',
    limit: String(options.limit || 10)
  })
  if (options.q) params.append('keywords', options.q)
  if (options.countries) params.append('countries', options.countries)

  const url = `${base}?${params.toString()}`
  request({ url, json: true, timeout: 10000 }, (err, resp) => {
    if (err) return callback('Gagal konek ke layanan berita', undefined)
    if (resp.body && resp.body.error) {
      return callback(resp.body.error.type || 'Terjadi error dari API', undefined)
    }
    const articles = (resp.body.data || []).map(a => ({
      title: a.title,
      description: a.description,
      source: a.source,
      url: a.url,
      published_at: a.published_at,
      image: a.image || null
    }))
    callback(undefined, articles)
  })
}

module.exports = getNews