import { useState, useEffect } from 'react'
import { Database, Globe, Info, ExternalLink, Sparkles, Key, Check, Zap, User, LogIn, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { configureImageService, getActiveProvider } from '../services/imageService'
import { useAuthContext } from '../contexts/AuthContext'

export default function SettingsPage() {
  const [hfToken, setHfToken] = useState(() => localStorage.getItem('erstaunlich-hf-token') || '')
  const [saved, setSaved] = useState(false)
  const { user, signOut } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize image service with saved token
    if (hfToken) {
      configureImageService({ huggingfaceToken: hfToken })
    }
  }, [])

  const saveToken = () => {
    localStorage.setItem('erstaunlich-hf-token', hfToken)
    configureImageService({ huggingfaceToken: hfToken })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const activeProvider = getActiveProvider()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Einstellungen</h1>

      <div className="space-y-3">
        {/* Account */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <User className="w-5 h-5 text-brand-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Konto</h3>
              <p className="text-xs text-gray-400">
                {user ? user.email : 'Nicht angemeldet'}
              </p>
            </div>
          </div>
          <div className="pl-12">
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Abmelden
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Anmelden / Registrieren
              </button>
            )}
          </div>
        </div>

        {/* AI Image Generation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">KI-Bildgenerierung</h3>
              <p className="text-xs text-gray-400">FLUX-basierte Bildgenerierung</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-500">
                {activeProvider === 'huggingface' ? 'FLUX.1' : 'Pollinations'}
              </span>
            </div>
          </div>
          <div className="pl-12 space-y-3">
            {/* Current provider info */}
            <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-lg p-3 border border-brand-100/60">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-xs font-semibold text-brand-700">
                  {activeProvider === 'huggingface'
                    ? 'FLUX.1-schnell via HuggingFace'
                    : 'FLUX via Pollinations (kostenlos)'}
                </span>
              </div>
              <p className="text-[10px] text-brand-600/80 leading-relaxed">
                {activeProvider === 'huggingface'
                  ? 'Schnelle, hochwertige Bildgenerierung über die HuggingFace Inference API.'
                  : 'Bilder funktionieren sofort ohne Token. Für schnellere Generierung einen HuggingFace Token hinzufügen.'}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">HuggingFace API Token (optional)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={hfToken}
                    onChange={(e) => setHfToken(e.target.value)}
                    placeholder="hf_..."
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  />
                </div>
                <button
                  onClick={saveToken}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    saved
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {saved ? <Check className="w-3.5 h-3.5" /> : 'Speichern'}
                </button>
              </div>
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-brand-500 hover:text-brand-600 mt-1 inline-block"
              >
                Token auf huggingface.co erstellen →
              </a>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Ein HuggingFace Token ermöglicht schnellere Bildgenerierung via FLUX.1-schnell.
              Ohne Token wird Pollinations.ai als kostenloser Dienst genutzt.
            </p>
          </div>
        </div>

        {/* Database status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <Database className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Datenquelle</h3>
              <p className="text-xs text-gray-400">Wiktionary + Supabase Caching</p>
            </div>
          </div>
          <div className="space-y-2 pl-12">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-500">Wiktionary API (aktiv)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-500">Supabase Cache (optional)</span>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-brand-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Sprache</h3>
              <p className="text-xs text-gray-400">Deutsch</p>
            </div>
            <select className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
              <option>Deutsch</option>
              <option>English</option>
            </select>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <Info className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Über Erstaunlich</h3>
              <p className="text-xs text-gray-400">Version 0.2.0</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 pl-12 leading-relaxed">
            Das umfassendste Wörterbuch der deutschen Sprache.
            Daten von Wiktionary, KI-generierte Illustrationen mit FLUX.
            Enthält Zugriff auf hunderttausende deutsche Wörter.
          </p>
        </div>

        {/* Supabase link */}
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-200 transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-sm">S</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
              Datenbank einrichten
            </h3>
            <p className="text-xs text-gray-400">Supabase-Projekt verbinden</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition-colors" />
        </a>
      </div>
    </div>
  )
}
