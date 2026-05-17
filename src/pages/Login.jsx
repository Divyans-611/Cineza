import PlaceholderPage from '../components/PlaceholderPage'

export default function Login() {
  return (
    <PlaceholderPage
      icon="🔐"
      title="Welcome Back"
      subtitle="Sign in to sync your watchlist, reviews, and personalized AI picks."
      features={[
        'Secure account sign-in',
        'Sync watchlist across devices',
        'Personalized recommendations',
      ]}
      phaseNote="Login will be connected in a later phase."
      primaryLabel="Browse Movies"
      primaryTo="/movies"
      secondaryLabel="Back to Home"
      secondaryTo="/"
    />
  )
}
