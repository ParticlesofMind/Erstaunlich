import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import WordPage from './pages/WordPage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import { configureImageService } from './services/imageService'

function App() {
  // Initialize image service from saved settings on startup
  useEffect(() => {
    const hfToken = localStorage.getItem('erstaunlich-hf-token')
    if (hfToken) {
      configureImageService({ huggingfaceToken: hfToken })
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      configureImageService({
        provider: 'supabase-edge',
        supabaseUrl,
        supabaseAnonKey,
      })
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
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
