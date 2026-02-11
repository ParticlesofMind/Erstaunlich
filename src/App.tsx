import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import WordPage from './pages/WordPage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import StoriesPage from './pages/StoriesPage'
import StoryPage from './pages/StoryPage'
import { configureImageService } from './services/imageService'

function App() {
  // Initialize image service from saved settings on startup
  useEffect(() => {
    const hfToken = localStorage.getItem('erstaunlich-hf-token')
    if (hfToken) {
      configureImageService({ huggingfaceToken: hfToken })
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/word/:id" element={<WordPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
