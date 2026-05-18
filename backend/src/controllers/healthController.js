// Health check — confirms the API server is up

export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: 'Cineza backend is running',
    version: '1.0.0',
  })
}
