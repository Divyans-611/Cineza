import { useParams } from 'react-router-dom'
import PlaceholderPage from '../components/PlaceholderPage'

export default function MovieDetails() {
  const { id } = useParams()

  return (
    <PlaceholderPage
      title="Movie Details"
      subtitle={`Full details for movie #${id} will be added in a later phase.`}
    />
  )
}
