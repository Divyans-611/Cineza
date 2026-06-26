import dns from 'dns'

// Override DNS lookup for TMDB domains to bypass ISP DNS hijacking/blocking in India.
// Queries public Google and Cloudflare DNS directly instead of OS resolution.
const originalLookup = dns.lookup
const resolver = new dns.Resolver()
resolver.setServers(['8.8.8.8', '1.1.1.1'])

dns.lookup = (hostname, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  
  if (hostname && (hostname.includes('themoviedb.org') || hostname.includes('tmdb.org'))) {
    resolver.resolve4(hostname, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return originalLookup(hostname, options, callback)
      }
      if (options && options.all) {
        const mapped = addresses.map(addr => ({ address: addr, family: 4 }))
        callback(null, mapped)
      } else {
        callback(null, addresses[0], 4)
      }
    })
  } else {
    originalLookup(hostname, options, callback)
  }
}

dns.setDefaultResultOrder('ipv4first')

import dotenv from 'dotenv'
import app from './app.js'
import config from './config/index.js'
import { connectDB } from './config/db.js'

// Load variables from .env (create your own from .env.example)
dotenv.config()

const PORT = config.port

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Cineza backend running on http://localhost:${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer()
