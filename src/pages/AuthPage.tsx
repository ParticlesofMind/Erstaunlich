import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Check } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { signIn, signUp } = useAuthContext()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
        navigate(-1)
      } else {
        await signUp(email, password)
        setSuccess('Registrierung erfolgreich! Bitte prüfe deine E-Mails zur Bestätigung.')
        setMode('signin')
      }
    } catch (err) {
      const msg = (err as Error).message
      if (msg.includes('Invalid login credentials')) {
        setError('Ungültige E-Mail oder Passwort.')
      } else if (msg.includes('already registered')) {
        setError('Diese E-Mail ist bereits registriert.')
      } else if (msg.includes('Password should be at least')) {
        setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">E</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {mode === 'signin' ? 'Willkommen zurück' : 'Konto erstellen'}
        </h1>
        <p className="text-sm text-gray-500">
          {mode === 'signin'
            ? 'Melde dich an, um deine Favoriten zu synchronisieren'
            : 'Erstelle ein Konto, um Favoriten und Fortschritt zu speichern'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-xl">
          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">E-Mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@beispiel.de"
              required
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Passwort</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Mindestens 6 Zeichen' : '••••••••'}
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (mode === 'signin' ? 'Anmelden…' : 'Registrieren…')
            : (mode === 'signin' ? 'Anmelden' : 'Konto erstellen')}
        </button>
      </form>

      {/* Toggle mode */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          {mode === 'signin' ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
              setSuccess(null)
            }}
            className="text-brand-600 font-medium hover:text-brand-700 transition-colors"
          >
            {mode === 'signin' ? 'Registrieren' : 'Anmelden'}
          </button>
        </p>
      </div>
    </div>
  )
}
