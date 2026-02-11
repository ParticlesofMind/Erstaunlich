import { useParams, Navigate } from 'react-router-dom'
import { stories } from '../data/stories'
import StoryReader from '../components/StoryReader'

export default function StoryPage() {
  const { id } = useParams<{ id: string }>()
  const story = stories.find((s) => s.id === id)

  if (!story) {
    return <Navigate to="/stories" replace />
  }

  return <StoryReader story={story} />
}
