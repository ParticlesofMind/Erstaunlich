import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import WordPage from './pages/WordPage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import StoriesPage from './pages/StoriesPage'
import StoryPage from './pages/StoryPage'
import AuthPage from './pages/AuthPage'
import QuizPage from './pages/QuizPage'
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
    <AuthProvider>
      <BrowserRouter basename="/Erstaunlich">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/word/:id" element={<WordPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:id" element={<StoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
