import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, CheckCircle2, XCircle, ArrowRight, Trophy, Lock, RotateCcw } from 'lucide-react'
import { useFavorites } from '../hooks/useDictionary'
import type { DictionaryEntry } from '../types/database'

/** Number of favorites needed to unlock one quiz */
const UNLOCK_EVERY = 10
/** Number of questions per quiz round */
const QUESTIONS_PER_QUIZ = 10

interface QuizQuestion {
  entry: DictionaryEntry
  type: 'definition' | 'article'
  correctAnswer: string
  options: string[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuiz(entries: DictionaryEntry[]): QuizQuestion[] {
  const pool = shuffle(entries)
  const questions: QuizQuestion[] = []

  for (const entry of pool.slice(0, QUESTIONS_PER_QUIZ)) {
    const word = entry.word

    // For nouns with an article, ask article question
    if (word.word_type === 'Substantiv' && word.article && Math.random() > 0.4) {
      questions.push({
        entry,
        type: 'article',
        correctAnswer: word.article,
        options: shuffle(['der', 'die', 'das']),
      })
    } else {
      // Definition question: pick the correct definition + 3 distractors
      const correctDef = entry.definitions[0]?.text || ''
      const distractors = shuffle(
        pool
          .filter((e) => e.word.id !== word.id)
          .map((e) => e.definitions[0]?.text || '')
          .filter(Boolean)
      ).slice(0, 3)

      if (correctDef && distractors.length >= 2) {
        questions.push({
          entry,
          type: 'definition',
          correctAnswer: correctDef,
          options: shuffle([correctDef, ...distractors.slice(0, 3)]),
        })
      }
    }
  }

  return questions
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { favorites, loading, favoriteEntries } = useFavorites()

  const quizzableEntries = useMemo(
    () => favoriteEntries.filter((e) => e.definitions.length > 0),
    [favoriteEntries]
  )

  const unlockedQuizzes = Math.floor(favorites.length / UNLOCK_EVERY)
  const nextUnlockAt = (unlockedQuizzes + 1) * UNLOCK_EVERY
  const canQuiz = unlockedQuizzes > 0 && quizzableEntries.length >= 4

  // Weekly check: only allow one quiz per week
  const [weeklyUsed, setWeeklyUsed] = useState(false)
  useEffect(() => {
    const lastQuiz = localStorage.getItem('erstaunlich-last-quiz')
    if (lastQuiz) {
      const lastDate = new Date(lastQuiz)
      const now = new Date()
      const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays < 7) setWeeklyUsed(true)
    }
  }, [])

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const startQuiz = useCallback(() => {
    const q = buildQuiz(quizzableEntries)
    setQuestions(q)
    setCurrentIdx(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    localStorage.setItem('erstaunlich-last-quiz', new Date().toISOString())
    setWeeklyUsed(true)
  }, [quizzableEntries])

  const handleAnswer = (answer: string) => {
    if (selected) return // already answered
    setSelected(answer)
    if (answer === questions[currentIdx].correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setSelected(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  // --- QUIZ IN PROGRESS ---
  if (questions.length > 0 && !finished) {
    const q = questions[currentIdx]
    const isCorrect = selected === q.correctAnswer

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">
            Frage {currentIdx + 1} / {questions.length}
          </span>
          <span className="text-sm font-medium text-brand-600">
            {score} richtig
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
          <div
            className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          {q.type === 'article' ? (
            <>
              <p className="text-sm text-gray-500 mb-2">Welcher Artikel gehört zu:</p>
              <h2 className="text-3xl font-bold text-gray-900">{q.entry.word.word}</h2>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">Was bedeutet:</p>
              <h2 className="text-3xl font-bold text-gray-900">{q.entry.word.word}</h2>
            </>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, i) => {
            let bg = 'bg-white border-gray-200 hover:border-brand-300'
            if (selected) {
              if (opt === q.correctAnswer) bg = 'bg-emerald-50 border-emerald-400'
              else if (opt === selected) bg = 'bg-red-50 border-red-400'
              else bg = 'bg-white border-gray-100 opacity-50'
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${bg}`}
              >
                <p className={`text-sm leading-relaxed ${q.type === 'article' ? 'text-lg font-semibold' : ''}`}>
                  {opt}
                </p>
              </button>
            )
          })}
        </div>

        {/* Feedback + Next */}
        {selected && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600">Richtig!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Falsch</span>
                </>
              )}
            </div>
            <button
              onClick={nextQuestion}
              className="flex items-center gap-1 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Weiter <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // --- QUIZ RESULTS ---
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <Trophy className={`w-16 h-16 mx-auto mb-4 ${pct >= 70 ? 'text-amber-400' : 'text-gray-300'}`} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz beendet!</h2>
        <p className="text-lg text-gray-600 mb-6">
          {score} von {questions.length} richtig ({pct}%)
        </p>
        {pct >= 70 ? (
          <p className="text-sm text-emerald-600 font-medium mb-8">Ausgezeichnet! Weiter so! 🎉</p>
        ) : (
          <p className="text-sm text-gray-500 mb-8">Übung macht den Meister! Wiederhole deine Favoriten.</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/favorites')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Zu Favoriten
          </button>
          <button
            onClick={() => {
              setQuestions([])
              setFinished(false)
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Nochmal
          </button>
        </div>
      </div>
    )
  }

  // --- QUIZ LOBBY ---
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Brain className="w-12 h-12 text-brand-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Vokabelquiz</h1>
        <p className="text-sm text-gray-500">Teste dein Wissen über deine Lieblingswörter</p>
      </div>

      {/* Progress toward next quiz */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Favoriten</span>
          <span className="text-sm text-gray-500">{favorites.length} / {nextUnlockAt}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (favorites.length / nextUnlockAt) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">
          {canQuiz
            ? `${unlockedQuizzes} Quiz${unlockedQuizzes > 1 ? 'ze' : ''} freigeschaltet`
            : `Noch ${nextUnlockAt - favorites.length} Wörter bis zum nächsten Quiz`}
        </p>
      </div>

      {/* Weekly cooldown */}
      {weeklyUsed && canQuiz && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-amber-700">Dein wöchentliches Quiz wurde bereits absolviert.</p>
          <p className="text-xs text-amber-500 mt-1">Nächste Woche kannst du wieder quizzen!</p>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={startQuiz}
        disabled={!canQuiz || weeklyUsed}
        className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
          canQuiz && !weeklyUsed
            ? 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {!canQuiz ? (
          <>
            <Lock className="w-5 h-5" /> Noch nicht freigeschaltet
          </>
        ) : weeklyUsed ? (
          <>
            <Lock className="w-5 h-5" /> Wöchentliches Limit erreicht
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" /> Quiz starten
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-8 space-y-3 text-xs text-gray-400">
        <p>• Für je {UNLOCK_EVERY} gespeicherte Favoriten wird ein Quiz freigeschaltet</p>
        <p>• Jede Woche kannst du ein Quiz absolvieren</p>
        <p>• Fragen basieren auf deinen Lieblingswörtern</p>
        <p>• Bei Substantiven wird auch der Artikel abgefragt</p>
      </div>
    </div>
  )
}
