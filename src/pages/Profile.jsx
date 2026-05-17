import PlaceholderPage from '../components/PlaceholderPage'

export default function Profile() {
  return (
    <PlaceholderPage
      icon="👤"
      title="Your Cineza Profile"
      subtitle="Track your reviews, badges, watchlist, and movie identity."
      showTagline
      features={[
        'Movie taste & genre preferences',
        'Badges for reviews and discovery',
        'Watchlist and activity history',
      ]}
      primaryLabel="Explore Movies"
      primaryTo="/movies"
      secondaryLabel="Back to Home"
      secondaryTo="/"
    />
  )
}
