import type { DictionaryEntry } from '../types/database'

// Mock data matching the screenshot - "erstaunlich" (amazing/astonishing)
export const mockEntries: DictionaryEntry[] = [
  {
    word: {
      id: '1',
      word: 'erstaunlich',
      pronunciation: 'er - staun - lich',
      syllables: 'er·staun·lich',
      word_type: 'Adjektiv',
      category: 'Emotional',
      difficulty: 3,
      frequency: 3,
      article: '',
      plural: '',
      conjugation: null,
      synonyms: ['beeindruckend', 'bemerkenswert', 'überraschend'],
      antonyms: ['gewöhnlich', 'langweilig', 'normal', 'unspektakulär'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd1', word_id: '1', text: 'Etwas, das sehr überraschend oder beeindruckend ist', order: 1 },
      { id: 'd2', word_id: '1', text: 'In Reaktion auf etwas sehr grosses oder ungewöhnliches', order: 2 },
    ],
    examples: [
      {
        id: 'e1',
        word_id: '1',
        text: 'Max ist ein erstaunlicher junger Mann. Mit nur acht Jahren kann er über eine ein Meter hohe Hecke springen, und das ohne Anlauf!',
        highlighted_word: 'erstaunlicher',
        image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&h=200&fit=crop',
        order: 1,
      },
      {
        id: 'e2',
        word_id: '1',
        text: 'Der Mount Everest ist über 8000 Meter hoch. Das ist erstaunlich!',
        highlighted_word: 'erstaunlich',
        image_url: 'https://images.unsplash.com/photo-1516908205727-40afad9449a8?w=200&h=200&fit=crop',
        order: 2,
      },
    ],
  },
  {
    word: {
      id: '2',
      word: 'Wanderlust',
      pronunciation: 'Wan - der - lust',
      syllables: 'Wan·der·lust',
      word_type: 'Substantiv',
      category: 'Emotional',
      difficulty: 2,
      frequency: 4,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Fernweh', 'Reiselust', 'Reisefieber'],
      antonyms: ['Heimweh', 'Sesshaftigkeit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd3', word_id: '2', text: 'Ein starkes Verlangen zu reisen und die Welt zu erkunden', order: 1 },
      { id: 'd4', word_id: '2', text: 'Die Freude am Wandern und Entdecken neuer Orte', order: 2 },
    ],
    examples: [
      {
        id: 'e3',
        word_id: '2',
        text: 'Die Wanderlust packte ihn, und er buchte sofort einen Flug nach Japan.',
        highlighted_word: 'Wanderlust',
        image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '3',
      word: 'Gemütlichkeit',
      pronunciation: 'Ge - müt - lich - keit',
      syllables: 'Ge·müt·lich·keit',
      word_type: 'Substantiv',
      category: 'Lifestyle',
      difficulty: 3,
      frequency: 3,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Behaglichkeit', 'Wohlbefinden', 'Komfort'],
      antonyms: ['Unbehagen', 'Kälte', 'Sterilität'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd5', word_id: '3', text: 'Ein Zustand oder Gefühl der Wärme, Freundlichkeit und des Wohlbefindens', order: 1 },
      { id: 'd6', word_id: '3', text: 'Eine gemütliche, einladende Atmosphäre', order: 2 },
    ],
    examples: [
      {
        id: 'e4',
        word_id: '3',
        text: 'Die Gemütlichkeit des kleinen Cafés zog viele Stammgäste an.',
        highlighted_word: 'Gemütlichkeit',
        image_url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '4',
      word: 'Schadenfreude',
      pronunciation: 'Scha - den - freu - de',
      syllables: 'Scha·den·freu·de',
      word_type: 'Substantiv',
      category: 'Emotional',
      difficulty: 4,
      frequency: 2,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Häme', 'Spottlust'],
      antonyms: ['Mitgefühl', 'Empathie', 'Mitleid'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd7', word_id: '4', text: 'Freude oder Vergnügen, das man beim Unglück anderer empfindet', order: 1 },
    ],
    examples: [
      {
        id: 'e5',
        word_id: '4',
        text: 'Er konnte seine Schadenfreude nicht verbergen, als sein Rivale stolperte.',
        highlighted_word: 'Schadenfreude',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '5',
      word: 'Zeitgeist',
      pronunciation: 'Zeit - geist',
      syllables: 'Zeit·geist',
      word_type: 'Substantiv',
      category: 'Philosophie',
      difficulty: 4,
      frequency: 2,
      article: 'der',
      plural: '',
      conjugation: null,
      synonyms: ['Epoche', 'Stimmung', 'Trend'],
      antonyms: ['Zeitlosigkeit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd8', word_id: '5', text: 'Der Geist oder die allgemeine Stimmung einer bestimmten Epoche', order: 1 },
      { id: 'd9', word_id: '5', text: 'Die intellektuelle und kulturelle Atmosphäre einer Zeit', order: 2 },
    ],
    examples: [
      {
        id: 'e6',
        word_id: '5',
        text: 'Das Buch fängt den Zeitgeist der 1920er Jahre perfekt ein.',
        highlighted_word: 'Zeitgeist',
        image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '6',
      word: 'Kindergarten',
      pronunciation: 'Kin - der - gar - ten',
      syllables: 'Kin·der·gar·ten',
      word_type: 'Substantiv',
      category: 'Bildung',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Kindergärten',
      conjugation: null,
      synonyms: ['Vorschule', 'Kita', 'Kindertagesstätte'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd10', word_id: '6', text: 'Eine Einrichtung für die Betreuung und Bildung von Kindern im Vorschulalter', order: 1 },
    ],
    examples: [
      {
        id: 'e7',
        word_id: '6',
        text: 'Im Kindergarten lernen die Kinder spielerisch soziale Kompetenzen.',
        highlighted_word: 'Kindergarten',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
]

export function getEntry(id: string): DictionaryEntry | undefined {
  return mockEntries.find((e) => e.word.id === id)
}

export function searchEntries(query: string): DictionaryEntry[] {
  const q = query.toLowerCase()
  return mockEntries.filter(
    (e) =>
      e.word.word.toLowerCase().includes(q) ||
      e.definitions.some((d) => d.text.toLowerCase().includes(q)) ||
      e.word.synonyms.some((s) => s.toLowerCase().includes(q))
  )
}

export function getWordOfTheDay(): DictionaryEntry {
  const dayIndex = new Date().getDate() % mockEntries.length
  return mockEntries[dayIndex]
}
