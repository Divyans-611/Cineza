import PlaceholderPage from '../components/PlaceholderPage'

export default function Watchlist() {
  return (
    <PlaceholderPage
      icon="🍿"
      title="Your Watchlist"
      subtitle="Save films you want to watch later and build your personal movie journey."
      features={[
        'Save movies from any details page',
        'Track what you plan to watch next',
        'Organize your cinema queue in one place',
      ]}
      primaryLabel="Discover Movies"
      primaryTo="/movies"
      secondaryLabel="Back to Home"
      secondaryTo="/"
    />
  )
}
