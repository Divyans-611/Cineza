import PlaceholderPage from '../components/PlaceholderPage'
import { Sparkles } from 'lucide-react'

export default function AiPicks() {
  return (
    <PlaceholderPage
      icon={<Sparkles size={48} color="var(--color-primary)" />}
      title="AI Picks"
      subtitle="Tell Cineza your mood and let AI suggest movies that fit your vibe."
      showTagline
      features={[
        'Mood-based movie matching',
        'Smart genre & tone suggestions',
        'Personalized watch recommendations',
      ]}
      primaryLabel="Browse Movies"
      primaryTo="/movies"
      secondaryLabel="Back to Home"
      secondaryTo="/"
    />
  )
}
