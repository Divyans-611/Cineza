import PlaceholderPage from '../components/PlaceholderPage'
import { MessageSquare } from 'lucide-react'

export default function Reviews() {
  return (
    <PlaceholderPage
      icon={<MessageSquare size={48} color="var(--color-primary)" />}
      title="Community Reviews"
      subtitle="Read what people are saying and share your own take on cinema."
      features={[
        'Rate and review your favorite films',
        'Discover trusted community opinions',
        'Earn badges for active reviewing',
      ]}
      primaryLabel="Explore Movies"
      primaryTo="/movies"
      secondaryLabel="Back to Home"
      secondaryTo="/"
    />
  )
}
