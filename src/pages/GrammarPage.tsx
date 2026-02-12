import { BookMarked } from 'lucide-react'
import { useState } from 'react'

interface GrammarTopic {
  id: string
  title: string
  shortDesc: string
  explanation: string
  examples: string[]
}

const grammarTopics: GrammarTopic[] = [
  {
    id: 'nominativ',
    title: 'Nominativ',
    shortDesc: 'Der Nominativ',
    explanation: 'Der Nominativ ist der erste Fall (1. Kasus) und wird für das Subjekt eines Satzes verwendet. Er beantwortet die Frage "Wer?" oder "Was?"',
    examples: [
      'Der Mann ist groß. (Wer ist groß? Der Mann)',
      'Die Katze schläft. (Was schläft? Die Katze)',
      'Ein Buch liegt auf dem Tisch. (Was liegt? Ein Buch)'
    ]
  },
  {
    id: 'genitiv',
    title: 'Genitiv',
    shortDesc: 'Der Genitiv',
    explanation: 'Der Genitiv ist der zweite Fall (2. Kasus) und drückt Besitztum oder Zugehörigkeit aus. Er beantwortet die Frage "Wessen?"',
    examples: [
      'Das Haus des Mannes ist groß. (Wessen Haus? Das Haus des Mannes)',
      'Die Farbe der Katze ist schwarz. (Wessen Farbe? Die Farbe der Katze)',
      'Der Titel des Buches ist interessant. (Wessen Titel? Der Titel des Buches)'
    ]
  },
  {
    id: 'dativ',
    title: 'Dativ',
    shortDesc: 'Der Dativ',
    explanation: 'Der Dativ ist der dritte Fall (3. Kasus) und wird für indirekte Objekte verwendet. Er beantwortet die Frage "Wem?" oder "Wo?"',
    examples: [
      'Ich gebe dem Mann ein Buch. (Wem gebe ich ein Buch? Dem Mann)',
      'Sie helfen der Frau. (Wem helfen sie? Der Frau)',
      'Das Bild hängt an der Wand. (Wo hängt es? An der Wand)'
    ]
  },
  {
    id: 'akkusativ',
    title: 'Akkusativ',
    shortDesc: 'Der Akkusativ',
    explanation: 'Der Akkusativ ist der vierte Fall (4. Kasus) und wird für direkte Objekte verwendet. Er beantwortet die Frage "Wen?" oder "Was?"',
    examples: [
      'Ich sehe den Mann. (Wen sehe ich? Den Mann)',
      'Sie kauft ein Buch. (Was kauft sie? Ein Buch)',
      'Du trinkst einen Kaffee. (Was trinkst du? Einen Kaffee)'
    ]
  },
  {
    id: 'praesens',
    title: 'Präsens (Gegenwart)',
    shortDesc: 'Die Gegenwart',
    explanation: 'Das Präsens ist die Gegenwart und wird verwendet, um Handlungen auszudrücken, die jetzt stattfinden oder für allgemein gültig sind.',
    examples: [
      'Ich lese ein Buch. (Jetzt, in diesem Moment)',
      'Der Zug fährt um 10 Uhr ab. (Ein regelmäßiges Ereignis)',
      'Wasser kocht bei 100 Grad. (Eine allgemeine Wahrheit)'
    ]
  },
  {
    id: 'praeteritum',
    title: 'Präteritum (Vergangenheit)',
    shortDesc: 'Die Vergangenheit',
    explanation: 'Das Präteritum ist die einfache Vergangenheit und wird hauptsächlich in Geschichten und schriftlichen Berichten verwendet.',
    examples: [
      'Ich las ein Buch. (Ich habe gelesen - Vergangenheit)',
      'Sie ging nach Hause. (Sie ist gegangen - Vergangenheit)',
      'Der Film war interessant. (War gut - Vergangenheit)'
    ]
  },
  {
    id: 'perfekt',
    title: 'Perfekt (Vollendete Gegenwart)',
    shortDesc: 'Die vollendete Gegenwart',
    explanation: 'Das Perfekt wird verwendet, um von Handlungen zu sprechen, die in der Vergangenheit stattgefunden haben, aber noch einen Bezug zur Gegenwart haben. Es wird häufiger verwendet als das Präteritum.',
    examples: [
      'Ich habe ein Buch gelesen. (Ich bin fertig)',
      'Sie ist nach Hause gegangen. (Sie ist dort)',
      'Wir sind nach Berlin gereist. (Und sind jetzt zurück)'
    ]
  },
  {
    id: 'futur',
    title: 'Futur (Zukunft)',
    shortDesc: 'Die Zukunft',
    explanation: 'Das Futur wird verwendet, um von zukünftigen Ereignissen zu sprechen. Es wird mit "werden" + Infinitiv gebildet.',
    examples: [
      'Ich werde ein Buch lesen. (In der Zukunft)',
      'Sie werden nach Hause gehen. (Später)',
      'Das wird interessant sein. (Vorhersage)'
    ]
  },
  {
    id: 'adj-deklination',
    title: 'Adjektivdeklination',
    shortDesc: 'Adjektive richtig verwenden',
    explanation: 'Adjektive verändern ihre Endung je nach Fall (Nominativ, Genitiv, Dativ, Akkusativ) und Genus (Maskulinum, Femininum, Neutrum).',
    examples: [
      'Ein großer Mann (Nominativ, Maskulinum)',
      'Das Buch eines großen Autors (Genitiv)',
      'Ein großes Buch liegt auf dem Tisch. (Akkusativ Nominativ)',
      'Die große Frau (Nominativ, Femininum)'
    ]
  },
  {
    id: 'pronomen',
    title: 'Pronomen',
    shortDesc: 'Fürwort - ein Ersatz für Substantive',
    explanation: 'Pronomen ersetzen Substantive. Es gibt verschiedene Arten: Personalpronomen (ich, du, er), Possessivpronomen (mein, dein, sein) und andere.',
    examples: [
      'Ich bin Lehrer. Du bist Schüler. Er ist Arzt. (Personalpronomen)',
      'Das ist mein Buch. Das ist dein Buch. Das ist sein Buch. (Possessivpronomen)',
      'Dieser Mann ist alt. Jene Frau ist jung. (Demonstrativpronomen)'
    ]
  }
]

export default function GrammarPage() {
  const [selectedId, setSelectedId] = useState('nominativ')

  const selectedTopic = grammarTopics.find(t => t.id === selectedId)

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto md:max-h-none max-h-[40vh]">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-gray-900">Grammatik</h2>
          </div>
          <p className="text-xs text-gray-500">
            Wähle ein Grammatik-Thema
          </p>
        </div>

        <div className="p-2">
          {grammarTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedId(topic.id)}
              className={`w-full text-left px-3 py-3 rounded-lg mb-2 transition-all ${
                selectedId === topic.id
                  ? 'bg-brand-100 border-l-4 border-brand-600 text-brand-900 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
              }`}
            >
              <div className="font-medium text-sm">{topic.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{topic.shortDesc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedTopic && (
          <div className="max-w-2xl mx-auto px-6 py-8 pb-24 md:pb-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h1>
              <p className="text-gray-500">{selectedTopic.shortDesc}</p>
            </div>

            {/* Explanation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Erklärung</h2>
              <p className="text-gray-700 leading-relaxed">{selectedTopic.explanation}</p>
            </div>

            {/* Examples */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Beispiele</h2>
              <div className="space-y-3">
                {selectedTopic.examples.map((example, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
