import type { DictionaryEntry } from '../types/database'

// Mock data organized by category
export const mockEntries: DictionaryEntry[] = [
  // Gefühle & Emotionen
  {
    word: {
      id: '1',
      word: 'erstaunlich',
      pronunciation: 'er - staun - lich',
      syllables: 'er·staun·lich',
      word_type: 'Adjektiv',
      category: 'Gefühle & Emotionen',
      difficulty: 3,
      frequency: 3,
      article: '',
      plural: '',
      conjugation: null,
      synonyms: ['beeindruckend', 'bemerkenswert', 'überraschend'],
      antonyms: ['gewöhnlich', 'langweilig', 'normal'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd1', word_id: '1', text: 'Etwas, das sehr überraschend oder beeindruckend ist', order: 1 },
    ],
    examples: [
      {
        id: 'e1',
        word_id: '1',
        text: 'Das ist wirklich erstaunlich!',
        highlighted_word: 'erstaunlich',
        image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '1a',
      word: 'Schadenfreude',
      pronunciation: 'Scha - den - freu - de',
      syllables: 'Scha·den·freu·de',
      word_type: 'Substantiv',
      category: 'Gefühle & Emotionen',
      difficulty: 4,
      frequency: 2,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Häme', 'Spottlust'],
      antonyms: ['Mitgefühl', 'Empathie'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd1a', word_id: '1a', text: 'Freude beim Unglück anderer', order: 1 },
    ],
    examples: [
      {
        id: 'e1a',
        word_id: '1a',
        text: 'Er konnte seine Schadenfreude nicht verbergen.',
        highlighted_word: 'Schadenfreude',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '1b',
      word: 'Fernweh',
      pronunciation: 'Fern - weh',
      syllables: 'Fern·weh',
      word_type: 'Substantiv',
      category: 'Gefühle & Emotionen',
      difficulty: 2,
      frequency: 3,
      article: 'das',
      plural: '',
      conjugation: null,
      synonyms: ['Wanderlust', 'Reiselust'],
      antonyms: ['Heimweh'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd1b', word_id: '1b', text: 'Sehnsucht nach ferner Heimat oder fernen Orten', order: 1 },
    ],
    examples: [
      {
        id: 'e1b',
        word_id: '1b',
        text: 'Das Fernweh packte sie nach Jahren im selben Ort.',
        highlighted_word: 'Fernweh',
        image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '1c',
      word: 'Hoffnung',
      pronunciation: 'Hoff - nung',
      syllables: 'Hoff·nung',
      word_type: 'Substantiv',
      category: 'Gefühle & Emotionen',
      difficulty: 1,
      frequency: 5,
      article: 'die',
      plural: 'Hoffnungen',
      conjugation: null,
      synonyms: ['Erwartung', 'Zuversicht'],
      antonyms: ['Hoffnungslosigkeit', 'Verzweiflung'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd1c', word_id: '1c', text: 'Zuversicht, dass etwas Gutes passiert', order: 1 },
    ],
    examples: [
      {
        id: 'e1c',
        word_id: '1c',
        text: 'Ich habe die Hoffnung nicht aufgegeben.',
        highlighted_word: 'Hoffnung',
        image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Natur & Umwelt
  {
    word: {
      id: '2',
      word: 'Wald',
      pronunciation: 'Wald',
      syllables: 'Wald',
      word_type: 'Substantiv',
      category: 'Natur & Umwelt',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Wälder',
      conjugation: null,
      synonyms: ['Forst', 'Gehölz', 'Holz'],
      antonyms: ['Steppe', 'Wüste'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd2', word_id: '2', text: 'Ein Gebiet mit vielen Bäumen', order: 1 },
    ],
    examples: [
      {
        id: 'e2',
        word_id: '2',
        text: 'Der deutsche Schwarzwald ist berühmt.',
        highlighted_word: 'Wald',
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '2a',
      word: 'Berg',
      pronunciation: 'Berg',
      syllables: 'Berg',
      word_type: 'Substantiv',
      category: 'Natur & Umwelt',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Berge',
      conjugation: null,
      synonyms: ['Gebirge', 'Höhe', 'Erhebung'],
      antonyms: ['Tal', 'Senke'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd2a', word_id: '2a', text: 'Eine hohe Landerhebung', order: 1 },
    ],
    examples: [
      {
        id: 'e2a',
        word_id: '2a',
        text: 'Der Mount Everest ist der höchste Berg der Welt.',
        highlighted_word: 'Berg',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '2b',
      word: 'Fluss',
      pronunciation: 'Fluss',
      syllables: 'Fluss',
      word_type: 'Substantiv',
      category: 'Natur & Umwelt',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Flüsse',
      conjugation: null,
      synonyms: ['Strom', 'Bach', 'Gewässer'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd2b', word_id: '2b', text: 'Ein natürlicher Wasserlauf', order: 1 },
    ],
    examples: [
      {
        id: 'e2b',
        word_id: '2b',
        text: 'Der Rhein ist der längste Fluss Deutschlands.',
        highlighted_word: 'Fluss',
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '2c',
      word: 'Baum',
      pronunciation: 'Baum',
      syllables: 'Baum',
      word_type: 'Substantiv',
      category: 'Natur & Umwelt',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Bäume',
      conjugation: null,
      synonyms: ['Gehölz', 'Strauch', 'Pflanze'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd2c', word_id: '2c', text: 'Eine große Pflanze mit Stamm und Krone', order: 1 },
    ],
    examples: [
      {
        id: 'e2c',
        word_id: '2c',
        text: 'Der alte Eichenbaum steht seit hundert Jahren.',
        highlighted_word: 'Baum',
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Essen & Trinken
  {
    word: {
      id: '3',
      word: 'Brot',
      pronunciation: 'Brot',
      syllables: 'Brot',
      word_type: 'Substantiv',
      category: 'Essen & Trinken',
      difficulty: 1,
      frequency: 5,
      article: 'das',
      plural: 'Brote',
      conjugation: null,
      synonyms: ['Laib', 'Gebäck'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd3', word_id: '3', text: 'Ein Lebensmittel aus Mehl, Wasser und Hefe', order: 1 },
    ],
    examples: [
      {
        id: 'e3',
        word_id: '3',
        text: 'Deutsches Brot ist weltberühmt.',
        highlighted_word: 'Brot',
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '3a',
      word: 'Kaffee',
      pronunciation: 'Kaf - fee',
      syllables: 'Kaf·fee',
      word_type: 'Substantiv',
      category: 'Essen & Trinken',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Kaffees',
      conjugation: null,
      synonyms: ['Mokka', 'Espresso'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd3a', word_id: '3a', text: 'Ein heißes Getränk aus gerösteten Kaffeebohnen', order: 1 },
    ],
    examples: [
      {
        id: 'e3a',
        word_id: '3a',
        text: 'Morgens trinke ich immer eine Tasse Kaffee.',
        highlighted_word: 'Kaffee',
        image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688e85a6f?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '3b',
      word: 'Wasser',
      pronunciation: 'Was - ser',
      syllables: 'Was·ser',
      word_type: 'Substantiv',
      category: 'Essen & Trinken',
      difficulty: 1,
      frequency: 5,
      article: 'das',
      plural: 'Wässer',
      conjugation: null,
      synonyms: ['Flüssigkeit', 'Nass'],
      antonyms: ['Trockenheit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd3b', word_id: '3b', text: 'Eine klare, farblose Flüssigkeit', order: 1 },
    ],
    examples: [
      {
        id: 'e3b',
        word_id: '3b',
        text: 'Wir müssen jeden Tag genug Wasser trinken.',
        highlighted_word: 'Wasser',
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Reisen & Orte
  {
    word: {
      id: '4',
      word: 'Wanderlust',
      pronunciation: 'Wan - der - lust',
      syllables: 'Wan·der·lust',
      word_type: 'Substantiv',
      category: 'Reisen & Orte',
      difficulty: 2,
      frequency: 4,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Fernweh', 'Reiselust'],
      antonyms: ['Sesshaftigkeit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd4', word_id: '4', text: 'Ein starkes Verlangen zu reisen und die Welt zu erkunden', order: 1 },
    ],
    examples: [
      {
        id: 'e4',
        word_id: '4',
        text: 'Diese Wanderlust treibt sie um die ganze Welt.',
        highlighted_word: 'Wanderlust',
        image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '4a',
      word: 'Stadt',
      pronunciation: 'Stadt',
      syllables: 'Stadt',
      word_type: 'Substantiv',
      category: 'Reisen & Orte',
      difficulty: 1,
      frequency: 5,
      article: 'die',
      plural: 'Städte',
      conjugation: null,
      synonyms: ['Metropole', 'Gemeinde'],
      antonyms: ['Dorf', 'Land'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd4a', word_id: '4a', text: 'Eine große Siedlung mit vielen Häusern', order: 1 },
    ],
    examples: [
      {
        id: 'e4a',
        word_id: '4a',
        text: 'Berlin ist die Hauptstadt Deutschlands.',
        highlighted_word: 'Stadt',
        image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '4b',
      word: 'Abenteuer',
      pronunciation: 'A - ben - teu - er',
      syllables: 'A·ben·teu·er',
      word_type: 'Substantiv',
      category: 'Reisen & Orte',
      difficulty: 2,
      frequency: 4,
      article: 'das',
      plural: 'Abenteuer',
      conjugation: null,
      synonyms: ['Erlebnis', 'Wagnis'],
      antonyms: ['Sicherheit', 'Routine'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd4b', word_id: '4b', text: 'Ein aufregendes und gefährliches Erlebnis', order: 1 },
    ],
    examples: [
      {
        id: 'e4b',
        word_id: '4b',
        text: 'Das Klettern im Himalaya ist ein großes Abenteuer.',
        highlighted_word: 'Abenteuer',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Alltag & Familie
  {
    word: {
      id: '5',
      word: 'Familie',
      pronunciation: 'Fa - mi - lie',
      syllables: 'Fa·mi·lie',
      word_type: 'Substantiv',
      category: 'Alltag & Familie',
      difficulty: 1,
      frequency: 5,
      article: 'die',
      plural: 'Familien',
      conjugation: null,
      synonyms: ['Sippe', 'Angehörige'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd5', word_id: '5', text: 'Eltern und Kinder, verwandte Personen', order: 1 },
    ],
    examples: [
      {
        id: 'e5',
        word_id: '5',
        text: 'Die Familie ist sehr wichtig in Deutschland.',
        highlighted_word: 'Familie',
        image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '5a',
      word: 'Haus',
      pronunciation: 'Haus',
      syllables: 'Haus',
      word_type: 'Substantiv',
      category: 'Alltag & Familie',
      difficulty: 1,
      frequency: 5,
      article: 'das',
      plural: 'Häuser',
      conjugation: null,
      synonyms: ['Gebäude', 'Wohnhaus', 'Behausung'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd5a', word_id: '5a', text: 'Ein Gebäude zum Wohnen', order: 1 },
    ],
    examples: [
      {
        id: 'e5a',
        word_id: '5a',
        text: 'Das weiße Haus ist sehr schön.',
        highlighted_word: 'Haus',
        image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '5b',
      word: 'Kind',
      pronunciation: 'Kind',
      syllables: 'Kind',
      word_type: 'Substantiv',
      category: 'Alltag & Familie',
      difficulty: 1,
      frequency: 5,
      article: 'das',
      plural: 'Kinder',
      conjugation: null,
      synonyms: ['Sohn', 'Tochter', 'Junge', 'Mädchen'],
      antonyms: ['Erwachsener', 'Greis'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd5b', word_id: '5b', text: 'Ein junger Mensch, Sohn oder Tochter', order: 1 },
    ],
    examples: [
      {
        id: 'e5b',
        word_id: '5b',
        text: 'Ich habe zwei Kinder.',
        highlighted_word: 'Kind',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Kultur & Kunst
  {
    word: {
      id: '6',
      word: 'Musik',
      pronunciation: 'Mu - sik',
      syllables: 'Mu·sik',
      word_type: 'Substantiv',
      category: 'Kultur & Kunst',
      difficulty: 1,
      frequency: 5,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Melodie', 'Gesang', 'Weise'],
      antonyms: ['Stille', 'Lärm'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd6', word_id: '6', text: 'Geordnete Folge von Tönen', order: 1 },
    ],
    examples: [
      {
        id: 'e6',
        word_id: '6',
        text: 'Musik hilft mir zu entspannen.',
        highlighted_word: 'Musik',
        image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '6a',
      word: 'Theater',
      pronunciation: 'The - a - ter',
      syllables: 'The·a·ter',
      word_type: 'Substantiv',
      category: 'Kultur & Kunst',
      difficulty: 2,
      frequency: 4,
      article: 'das',
      plural: 'Theater',
      conjugation: null,
      etymology: [
        'griech. theatron "Schauplatz"',
        'lat. theatrum',
        'frz. theatre',
      ],
      synonyms: ['Schauplatz', 'Bühne'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd6a', word_id: '6a', text: 'Ein Gebäude für dramatische oder musikalische Aufführungen', order: 1 },
    ],
    examples: [
      {
        id: 'e6a',
        word_id: '6a',
        text: 'Wir gehen heute ins Theater.',
        highlighted_word: 'Theater',
        image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '6b',
      word: 'Gemütlichkeit',
      pronunciation: 'Ge - müt - lich - keit',
      syllables: 'Ge·müt·lich·keit',
      word_type: 'Substantiv',
      category: 'Kultur & Kunst',
      difficulty: 3,
      frequency: 3,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Behaglichkeit', 'Wohlbefinden'],
      antonyms: ['Unbehagen'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd6b', word_id: '6b', text: 'Ein Zustand oder Gefühl der Wärme, Freundlichkeit und des Wohlbefindens', order: 1 },
    ],
    examples: [
      {
        id: 'e6b',
        word_id: '6b',
        text: 'Die Gemütlichkeit des kleinen Cafés zog viele Stammgäste an.',
        highlighted_word: 'Gemütlichkeit',
        image_url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Körper & Gesundheit
  {
    word: {
      id: '7',
      word: 'Gesundheit',
      pronunciation: 'Ge - sund - heit',
      syllables: 'Ge·sund·heit',
      word_type: 'Substantiv',
      category: 'Körper & Gesundheit',
      difficulty: 2,
      frequency: 5,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Wohlbefinden', 'Fitness'],
      antonyms: ['Krankheit', 'Leiden'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd7', word_id: '7', text: 'Zustand des körperlichen und seelischen Wohlbefindens', order: 1 },
    ],
    examples: [
      {
        id: 'e7',
        word_id: '7',
        text: 'Gesundheit ist wichtiger als Reichtum.',
        highlighted_word: 'Gesundheit',
        image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '7a',
      word: 'Herz',
      pronunciation: 'Herz',
      syllables: 'Herz',
      word_type: 'Substantiv',
      category: 'Körper & Gesundheit',
      difficulty: 1,
      frequency: 5,
      article: 'das',
      plural: 'Herzen',
      conjugation: null,
      synonyms: ['Kardiom', 'Organ'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd7a', word_id: '7a', text: 'Das Organ, das Blut durch den Körper pumpt', order: 1 },
    ],
    examples: [
      {
        id: 'e7a',
        word_id: '7a',
        text: 'Mein Herz schlägt schneller vor Aufregung.',
        highlighted_word: 'Herz',
        image_url: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '7b',
      word: 'Auge',
      pronunciation: 'Au - ge',
      syllables: 'Au·ge',
      word_type: 'Substantiv',
      category: 'Körper & Gesundheit',
      difficulty: 1,
      frequency: 5,
      article: 'das',
      plural: 'Augen',
      conjugation: null,
      synonyms: ['Seher', 'Lid'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd7b', word_id: '7b', text: 'Das Organ zum Sehen', order: 1 },
    ],
    examples: [
      {
        id: 'e7b',
        word_id: '7b',
        text: 'Sie hat wunderschöne blaue Augen.',
        highlighted_word: 'Auge',
        image_url: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Beruf & Arbeit
  {
    word: {
      id: '8',
      word: 'Arbeit',
      pronunciation: 'Ar - beit',
      syllables: 'Ar·beit',
      word_type: 'Substantiv',
      category: 'Beruf & Arbeit',
      difficulty: 1,
      frequency: 5,
      article: 'die',
      plural: 'Arbeiten',
      conjugation: null,
      synonyms: ['Werk', 'Tat', 'Tätigkeit'],
      antonyms: ['Faulheit', 'Trägheit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd8', word_id: '8', text: 'Tätigkeit, bei der man etwas hervorbringt oder Dienste leistet', order: 1 },
    ],
    examples: [
      {
        id: 'e8',
        word_id: '8',
        text: 'Die Arbeit in diesem Büro ist sehr interessant.',
        highlighted_word: 'Arbeit',
        image_url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '8a',
      word: 'Lehrer',
      pronunciation: 'Leh - rer',
      syllables: 'Leh·rer',
      word_type: 'Substantiv',
      category: 'Beruf & Arbeit',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Lehrer',
      conjugation: null,
      synonyms: ['Pädagoge', 'Kurator'],
      antonyms: ['Schüler'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd8a', word_id: '8a', text: 'Eine Person, die unterrichtet', order: 1 },
    ],
    examples: [
      {
        id: 'e8a',
        word_id: '8a',
        text: 'Mein Lehrer ist sehr streng.',
        highlighted_word: 'Lehrer',
        image_url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '8b',
      word: 'Kindergarten',
      pronunciation: 'Kin - der - gar - ten',
      syllables: 'Kin·der·gar·ten',
      word_type: 'Substantiv',
      category: 'Beruf & Arbeit',
      difficulty: 1,
      frequency: 5,
      article: 'der',
      plural: 'Kindergärten',
      conjugation: null,
      synonyms: ['Vorschule', 'Kita'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd8b', word_id: '8b', text: 'Eine Einrichtung für die Betreuung und Bildung von Vorschulkindern', order: 1 },
    ],
    examples: [
      {
        id: 'e8b',
        word_id: '8b',
        text: 'Im Kindergarten lernen die Kinder spielerisch.',
        highlighted_word: 'Kindergarten',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Wissenschaft
  {
    word: {
      id: '9',
      word: 'Wissenschaft',
      pronunciation: 'Wis - sen - schaft',
      syllables: 'Wis·sen·schaft',
      word_type: 'Substantiv',
      category: 'Wissenschaft',
      difficulty: 3,
      frequency: 4,
      article: 'die',
      plural: 'Wissenschaften',
      conjugation: null,
      synonyms: ['Forschung', 'Lehre'],
      antonyms: ['Glaube', 'Aberglaube'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd9', word_id: '9', text: 'Das systematische Studium und die Erforschung von Fakten', order: 1 },
    ],
    examples: [
      {
        id: 'e9',
        word_id: '9',
        text: 'Wissenschaft und Technologie sind eng verbunden.',
        highlighted_word: 'Wissenschaft',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '9a',
      word: 'Experiment',
      pronunciation: 'Ex - pe - ri - ment',
      syllables: 'Ex·pe·ri·ment',
      word_type: 'Substantiv',
      category: 'Wissenschaft',
      difficulty: 2,
      frequency: 4,
      article: 'das',
      plural: 'Experimente',
      conjugation: null,
      synonyms: ['Versuch', 'Test'],
      antonyms: [],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd9a', word_id: '9a', text: 'Ein durchdachter Versuch zur Erprobung oder Bestätigung einer These', order: 1 },
    ],
    examples: [
      {
        id: 'e9a',
        word_id: '9a',
        text: 'Das chemische Experiment war sehr erfolgreich.',
        highlighted_word: 'Experiment',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '9b',
      word: 'Theorie',
      pronunciation: 'The - o - rie',
      syllables: 'The·o·rie',
      word_type: 'Substantiv',
      category: 'Wissenschaft',
      difficulty: 3,
      frequency: 4,
      article: 'die',
      plural: 'Theorien',
      conjugation: null,
      synonyms: ['Lehre', 'Hypothese'],
      antonyms: ['Praxis', 'Wirklichkeit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd9b', word_id: '9b', text: 'Ein System von Ideen und Grundsätzen zur Erklärung von Phänomenen', order: 1 },
    ],
    examples: [
      {
        id: 'e9b',
        word_id: '9b',
        text: 'Einsteins Theorie der Relativität revolutionierte die Physik.',
        highlighted_word: 'Theorie',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },

  // Philosophie & Geschichte
  {
    word: {
      id: '10',
      word: 'Zeitgeist',
      pronunciation: 'Zeit - geist',
      syllables: 'Zeit·geist',
      word_type: 'Substantiv',
      category: 'Philosophie & Geschichte',
      difficulty: 4,
      frequency: 2,
      article: 'der',
      plural: '',
      conjugation: null,
      synonyms: ['Epoche', 'Trend', 'Stimmung'],
      antonyms: ['Zeitlosigkeit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd10', word_id: '10', text: 'Der Geist oder die allgemeine Stimmung einer bestimmten Epoche', order: 1 },
    ],
    examples: [
      {
        id: 'e10',
        word_id: '10',
        text: 'Das Buch fängt den Zeitgeist der 1920er Jahre perfekt ein.',
        highlighted_word: 'Zeitgeist',
        image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '10a',
      word: 'Freiheit',
      pronunciation: 'Frei - heit',
      syllables: 'Frei·heit',
      word_type: 'Substantiv',
      category: 'Philosophie & Geschichte',
      difficulty: 3,
      frequency: 4,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Unabhängigkeit', 'Befreiung'],
      antonyms: ['Knechtschaft', 'Gefangenschaft'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd10a', word_id: '10a', text: 'Der Zustand des Nicht-Unterworfenseins; Unabhängigkeit', order: 1 },
    ],
    examples: [
      {
        id: 'e10a',
        word_id: '10a',
        text: 'In einer Demokratie ist Freiheit ein Grundrecht.',
        highlighted_word: 'Freiheit',
        image_url: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=200&h=260&fit=crop',
        order: 1,
      },
    ],
  },
  {
    word: {
      id: '10b',
      word: 'Wahrheit',
      pronunciation: 'Wahr - heit',
      syllables: 'Wahr·heit',
      word_type: 'Substantiv',
      category: 'Philosophie & Geschichte',
      difficulty: 3,
      frequency: 4,
      article: 'die',
      plural: '',
      conjugation: null,
      synonyms: ['Realität', 'Tatsache'],
      antonyms: ['Lüge', 'Falschheit'],
      created_at: new Date().toISOString(),
    },
    definitions: [
      { id: 'd10b', word_id: '10b', text: 'Die Übereinstimmung mit der Wirklichkeit', order: 1 },
    ],
    examples: [
      {
        id: 'e10b',
        word_id: '10b',
        text: 'Die Wahrheit ist manchmal schwer zu akzeptieren.',
        highlighted_word: 'Wahrheit',
        image_url: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=200&h=260&fit=crop',
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

export function getCategoryEntries(categoryName: string): DictionaryEntry[] {
  return mockEntries.filter((e) => e.word.category === categoryName)
}

export function getWordOfTheDay(): DictionaryEntry {
  const dayIndex = new Date().getDate() % mockEntries.length
  return mockEntries[dayIndex]
}
