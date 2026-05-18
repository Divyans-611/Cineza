// Central place for environment-based settings (expand in later phases)

const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
}

export default config
