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
import NewspaperPage from './pages/NewspaperPage'
import GrammarPage from './pages/GrammarPage'
import GrammarTestPage from './pages/GrammarTestPage'
import { configureImageService } from './services/imageService'
import { preloadCategoryCache } from './services/categoryCache'

function App() {
  // Initialize image service and category cache on startup
  useEffect(() => {
    const hfToken = localStorage.getItem('erstaunlich-hf-token')
    if (hfToken) {
      configureImageService({ huggingfaceToken: hfToken })
    }
    
    // Pre-fetch category words in background
    preloadCategoryCache().catch((err) => {
      console.warn('Failed to preload category cache:', err)
    })
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
            <Route path="/vocab-test" element={<QuizPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:id" element={<StoryPage />} />
            <Route path="/newspaper" element={<NewspaperPage />} />
            <Route path="/grammar" element={<GrammarPage />} />
            <Route path="/grammar-test" element={<GrammarTestPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
