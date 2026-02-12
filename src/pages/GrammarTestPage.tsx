import { Brain, CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'Welcher Fall wird mit "Wem?" beantwortet?',
    options: ['Nominativ', 'Genitiv', 'Dativ', 'Akkusativ'],
    correct: 2,
    explanation: 'Der Dativ beantwortet die Frage "Wem?" oder "Wo?" und wird für indirekte Objekte verwendet.'
  },
  {
    id: 'q2',
    question: 'Ergänze: "Ich _____ ein Buch gelesen." (Perfekt)',
    options: ['habe', 'bin', 'werde', 'hatte'],
    correct: 0,
    explanation: 'Das Perfekt wird mit "haben" oder "sein" + Partizip II gebildet. "Ich habe ein Buch gelesen."'
  },
  {
    id: 'q3',
    question: 'Was ist die korrekte Form im Akkusativ (Maskulinum)?',
    options: ['der Mann', 'den Mann', 'dem Mann', 'des Mannes'],
    correct: 1,
    explanation: 'Im Akkusativ (4. Fall) ändert sich der Artikel bei Maskulinum von "der" zu "den".'
  },
  {
    id: 'q4',
    question: 'Welcher Satz ist im Präteritum?',
    options: ['Ich lese ein Buch.', 'Ich habe ein Buch gelesen.', 'Ich las ein Buch.', 'Ich werde ein Buch lesen.'],
    correct: 2,
    explanation: 'Das Präteritum ist "Ich las ein Buch." Es ist die einfache Vergangenheit.'
  },
  {
    id: 'q5',
    question: 'Welche Adjektivendung passt? "Der _____ Mann (großen)"',
    options: ['-er', '-en', '-es', '-em'],
    correct: 0,
    explanation: 'Im Nominativ (Maskulinum) endet das Adjektiv auf "-er": "Der große Mann".'
  }
]

export default function GrammarTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answered[currentQuestion.id]
  const isAnswered = currentAnswer !== undefined

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return // Already answered
    
    setAnswered(prev => ({ ...prev, [currentQuestion.id]: optionIdx }))
    
    if (optionIdx === currentQuestion.correct) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setFinished(true)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setScore(0)
    setAnswered({})
    setFinished(false)
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="text-center">
          <div className="mb-6">
            <Brain className="w-16 h-16 text-brand-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ergebnisse</h1>
          <p className="text-gray-500 mb-8">Grammatiktest abgeschlossen</p>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <div className="text-5xl font-bold text-brand-600 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-gray-600 mb-6">
              {percentage}% Korrekt
            </div>

            <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
              percentage >= 80 ? 'bg-green-100 text-green-700' :
              percentage >= 60 ? 'bg-blue-100 text-blue-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {percentage >= 80 ? 'Sehr gut!' : percentage >= 60 ? 'Gut gemacht!' : 'Weiter üben!'}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors"
          >
            Nochmal versuchen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-600" />
            <h1 className="text-2xl font-bold text-gray-900">Grammatiktest</h1>
          </div>
          <div className="text-sm text-gray-500">
            Frage {currentIndex + 1}/{questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = currentAnswer === idx
            const isCorrect = idx === currentQuestion.correct
            const shouldShowCorrect = isAnswered && isCorrect
            const shouldShowWrong = isAnswered && isSelected && !isCorrect

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
                  shouldShowCorrect
                    ? 'bg-green-50 border-green-500 text-green-900'
                    : shouldShowWrong
                    ? 'bg-red-50 border-red-500 text-red-900'
                    : isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-900'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {shouldShowCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {shouldShowWrong && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`p-4 rounded-lg border-2 ${
            currentAnswer === currentQuestion.correct
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className="font-semibold text-gray-900 mb-2">Erklärung:</p>
            <p className="text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors"
        >
          {currentIndex === questions.length - 1 ? 'Ergebnisse anzeigen' : 'Nächste Frage'}
        </button>
      )}
    </div>
  )
}
