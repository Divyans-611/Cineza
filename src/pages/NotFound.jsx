import PlaceholderPage, { BackHomeButton } from '../components/PlaceholderPage'

export default function NotFound() {
  return (
    <PlaceholderPage
      title="404 — Scene Not Found"
      subtitle="This page seems to have missed its release date."
    >
      <BackHomeButton />
    </PlaceholderPage>
  )
}
