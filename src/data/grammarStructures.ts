/**
 * Grammar Structures by CEFR Level
 * 
 * Organized systematic grammar patterns for German learners
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface GrammarStructure {
  id: string
  level: CEFRLevel
  name: string
  pattern: string
  explanation: string
  examples: string[]
  topics: string[]
  relatedVocab?: string[]
  difficulty: number // 1-5
}

export const grammarStructures: GrammarStructure[] = [
  // A1 Level - Beginner
  {
    id: 'a1-main-clause',
    level: 'A1',
    name: 'Hauptsatz (V2-Stellung)',
    pattern: 'Subjekt + konjugiertes Verb + Objekt/Komplement',
    explanation: 'Im Deutschen steht das konjugierte Verb immer an zweiter Position im Hauptsatz.',
    examples: [
      'Ich heiße Anna.',
      'Ich wohne in Berlin.',
      'Du lernst Deutsch.',
      'Er trinkt Kaffee.',
    ],
    topics: ['Alltag', 'Vorstellen', 'Wohnen'],
    difficulty: 1,
  },
  {
    id: 'a1-w-questions',
    level: 'A1',
    name: 'W-Fragen',
    pattern: 'Fragewort + konjugiertes Verb + Subjekt + ...?',
    explanation: 'W-Fragen beginnen mit Fragewörtern wie wo, wer, was, wann, warum, wie.',
    examples: [
      'Wo wohnst du?',
      'Was machst du?',
      'Wer bist du?',
      'Wann kommst du?',
      'Wie heißt du?',
    ],
    topics: ['Alltag', 'Kennenlernen', 'Fragen stellen'],
    difficulty: 1,
  },
  {
    id: 'a1-yes-no-questions',
    level: 'A1',
    name: 'Ja/Nein-Fragen',
    pattern: 'Konjugiertes Verb + Subjekt + ...?',
    explanation: 'Bei Ja/Nein-Fragen steht das Verb an erster Position.',
    examples: [
      'Bist du müde?',
      'Hast du Hunger?',
      'Kommst du mit?',
      'Sprichst du Deutsch?',
    ],
    topics: ['Alltag', 'Befinden', 'Einfache Fragen'],
    difficulty: 1,
  },
  {
    id: 'a1-negation',
    level: 'A1',
    name: 'Verneinung',
    pattern: 'Subjekt + Verb + ... + nicht / kein + Nomen',
    explanation: '"nicht" negiert Verben und Adjektive, "kein" negiert Nomen.',
    examples: [
      'Ich trinke keinen Kaffee.',
      'Das ist nicht gut.',
      'Ich habe keine Zeit.',
      'Er kommt nicht.',
    ],
    topics: ['Ablehnung', 'Vorlieben', 'Alltag'],
    difficulty: 2,
  },
  {
    id: 'a1-imperative',
    level: 'A1',
    name: 'Imperativ',
    pattern: 'Verb (Stamm) + ...!',
    explanation: 'Der Imperativ wird für Befehle und Aufforderungen verwendet.',
    examples: [
      'Komm!',
      'Trink Wasser!',
      'Geh nach Hause!',
      'Lern Deutsch!',
    ],
    topics: ['Befehle', 'Aufforderungen', 'Ratschläge'],
    difficulty: 2,
  },

  // A2 Level - Elementary
  {
    id: 'a2-separable-verbs',
    level: 'A2',
    name: 'Trennbare Verben',
    pattern: 'Subjekt + konjugiertes Verb + ... + Präfix (Ende)',
    explanation: 'Bei trennbaren Verben steht das Präfix am Satzende.',
    examples: [
      'Ich stehe um 7 Uhr auf.',
      'Er ruft mich an.',
      'Wir kaufen im Supermarkt ein.',
      'Sie macht die Tür zu.',
    ],
    topics: ['Alltag', 'Tagesablauf', 'Aktivitäten'],
    relatedVocab: ['aufstehen', 'anrufen', 'einkaufen', 'zumachen'],
    difficulty: 2,
  },
  {
    id: 'a2-modal-verbs',
    level: 'A2',
    name: 'Modalverben',
    pattern: 'Modalverb (Position 2) + ... + Infinitiv (am Ende)',
    explanation: 'Modalverben (können, müssen, wollen, sollen, dürfen, mögen) stehen auf Position 2, der Infinitiv am Ende.',
    examples: [
      'Ich kann schwimmen.',
      'Er muss arbeiten.',
      'Wir wollen Deutsch lernen.',
      'Du darfst hier nicht rauchen.',
    ],
    topics: ['Fähigkeiten', 'Pflichten', 'Wünsche'],
    relatedVocab: ['können', 'müssen', 'wollen', 'sollen', 'dürfen'],
    difficulty: 3,
  },
  {
    id: 'a2-perfekt',
    level: 'A2',
    name: 'Perfekt',
    pattern: 'haben/sein (Position 2) + ... + Partizip II (am Ende)',
    explanation: 'Das Perfekt beschreibt abgeschlossene Handlungen in der Vergangenheit.',
    examples: [
      'Ich habe gegessen.',
      'Ich bin gegangen.',
      'Er hat gearbeitet.',
      'Wir sind nach Berlin gefahren.',
    ],
    topics: ['Vergangenheit', 'Erlebnisse', 'Erzählen'],
    difficulty: 3,
  },
  {
    id: 'a2-weil',
    level: 'A2',
    name: 'Nebensatz mit "weil"',
    pattern: 'weil + Subjekt + ... + Verb (Ende)',
    explanation: 'In Nebensätzen mit "weil" steht das Verb am Ende. "Weil" gibt einen Grund an.',
    examples: [
      'Ich lerne Deutsch, weil ich nach Deutschland reisen möchte.',
      'Er bleibt zu Hause, weil er krank ist.',
      'Wir essen Pizza, weil wir Hunger haben.',
      'Sie ist glücklich, weil sie einen neuen Job hat.',
    ],
    topics: ['Begründungen', 'Erklärungen', 'Alltag'],
    difficulty: 3,
  },
  {
    id: 'a2-dass',
    level: 'A2',
    name: 'Nebensatz mit "dass"',
    pattern: 'dass + Subjekt + ... + Verb (Ende)',
    explanation: 'Nach Verben wie "denken", "glauben", "hoffen" folgt oft ein "dass"-Satz.',
    examples: [
      'Ich denke, dass es gut ist.',
      'Er glaubt, dass sie recht hat.',
      'Wir hoffen, dass es morgen nicht regnet.',
      'Sie sagt, dass sie morgen kommt.',
    ],
    topics: ['Meinungen', 'Hoffnungen', 'Aussagen'],
    difficulty: 3,
  },
  {
    id: 'a2-wenn-condition',
    level: 'A2',
    name: 'Nebensatz mit "wenn" (Bedingung)',
    pattern: 'wenn + Subjekt + ... + Verb (Ende)',
    explanation: '"Wenn" leitet Bedingungssätze ein.',
    examples: [
      'Wenn es regnet, bleibe ich zu Hause.',
      'Wenn du Zeit hast, können wir uns treffen.',
      'Wenn ich Geld habe, kaufe ich ein neues Auto.',
      'Wenn sie kommt, sage ich es dir.',
    ],
    topics: ['Bedingungen', 'Planung', 'Alltag'],
    difficulty: 3,
  },

  // B1 Level - Intermediate
  {
    id: 'b1-obwohl',
    level: 'B1',
    name: 'Nebensatz mit "obwohl"',
    pattern: 'obwohl + Subjekt + ... + Verb (Ende)',
    explanation: '"Obwohl" drückt einen Kontrast oder Widerspruch aus.',
    examples: [
      'Obwohl es teuer ist, kaufe ich es.',
      'Er geht zur Arbeit, obwohl er krank ist.',
      'Sie lernt Deutsch, obwohl es schwierig ist.',
      'Wir gehen spazieren, obwohl es regnet.',
    ],
    topics: ['Kontraste', 'Entscheidungen', 'Alltag'],
    relatedVocab: ['trotzdem', 'dennoch'],
    difficulty: 4,
  },
  {
    id: 'b1-bevor-nachdem',
    level: 'B1',
    name: 'Nebensatz mit "bevor" / "nachdem"',
    pattern: 'bevor/nachdem + Subjekt + ... + Verb (Ende)',
    explanation: '"Bevor" und "nachdem" beschreiben zeitliche Abfolgen.',
    examples: [
      'Bevor ich esse, wasche ich die Hände.',
      'Nachdem ich gegessen habe, trinke ich Kaffee.',
      'Bevor du gehst, ruf mich an.',
      'Nachdem er angekommen ist, ruht er sich aus.',
    ],
    topics: ['Zeitliche Abfolgen', 'Routinen', 'Alltag'],
    difficulty: 4,
  },
  {
    id: 'b1-damit',
    level: 'B1',
    name: 'Nebensatz mit "damit"',
    pattern: 'damit + Subjekt + ... + Verb (Ende)',
    explanation: '"Damit" drückt einen Zweck oder ein Ziel aus.',
    examples: [
      'Ich lerne, damit ich einen Job finde.',
      'Er spart Geld, damit er ein Auto kaufen kann.',
      'Sie übt jeden Tag, damit sie besser wird.',
      'Wir sprechen langsam, damit du verstehst.',
    ],
    topics: ['Ziele', 'Absichten', 'Motivation'],
    difficulty: 4,
  },
  {
    id: 'b1-relative-clause',
    level: 'B1',
    name: 'Relativsatz',
    pattern: 'der/die/das/welcher + ... + Verb (Ende)',
    explanation: 'Relativsätze beschreiben Nomen näher. Das Relativpronomen richtet sich nach Genus und Kasus.',
    examples: [
      'Der Mann, der dort wohnt, ist mein Lehrer.',
      'Die Frau, die ich gestern gesehen habe, ist sehr nett.',
      'Das Buch, das ich lese, ist interessant.',
      'Die Leute, die hier arbeiten, sind freundlich.',
    ],
    topics: ['Beschreibungen', 'Personen', 'Dinge'],
    difficulty: 4,
  },
  {
    id: 'b1-konjunktiv2-wuerde',
    level: 'B1',
    name: 'Konjunktiv II mit "würde"',
    pattern: 'würde + ... + Infinitiv (am Ende)',
    explanation: 'Der Konjunktiv II mit "würde" drückt Höflichkeit oder Hypothetisches aus.',
    examples: [
      'Ich würde gerne kommen.',
      'Er würde das Auto kaufen, wenn er Geld hätte.',
      'Würdest du mir helfen?',
      'Wir würden gerne mehr Zeit haben.',
    ],
    topics: ['Höflichkeit', 'Hypothetisches', 'Wünsche'],
    difficulty: 4,
  },
  {
    id: 'b1-passive',
    level: 'B1',
    name: 'Passiv',
    pattern: 'werden + ... + Partizip II (am Ende)',
    explanation: 'Das Passiv betont die Handlung statt des Handelnden.',
    examples: [
      'Das Buch wird gelesen.',
      'Das Auto wird repariert.',
      'Die Tür wird geschlossen.',
      'Der Brief wird geschrieben.',
    ],
    topics: ['Beschreibungen', 'Prozesse', 'Formelle Sprache'],
    difficulty: 4,
  },
  {
    id: 'b1-um-zu',
    level: 'B1',
    name: 'Finalsatz mit "um ... zu"',
    pattern: 'um ... zu + Infinitiv',
    explanation: '"Um ... zu" drückt einen Zweck aus (gleiches Subjekt in beiden Satzteilen).',
    examples: [
      'Ich gehe in die Stadt, um einzukaufen.',
      'Er lernt viel, um die Prüfung zu bestehen.',
      'Sie übt täglich, um besser zu werden.',
      'Wir sparen Geld, um zu reisen.',
    ],
    topics: ['Ziele', 'Absichten', 'Motivation'],
    difficulty: 4,
  },

  // B2 Level - Upper Intermediate
  {
    id: 'b2-waehrend',
    level: 'B2',
    name: 'Nebensatz mit "während"',
    pattern: 'während + Subjekt + ... + Verb (Ende)',
    explanation: '"Während" beschreibt zwei gleichzeitige Handlungen.',
    examples: [
      'Während ich lerne, höre ich Musik.',
      'Er kocht, während sie fernsieht.',
      'Während du schläfst, arbeite ich.',
      'Sie telefoniert, während sie Auto fährt.',
    ],
    topics: ['Gleichzeitigkeit', 'Multitasking', 'Alltag'],
    difficulty: 4,
  },
  {
    id: 'b2-als-past',
    level: 'B2',
    name: 'Nebensatz mit "als" (einmalig)',
    pattern: 'als + Subjekt + ... + Verb (Ende)',
    explanation: '"Als" beschreibt ein einmaliges Ereignis in der Vergangenheit.',
    examples: [
      'Als ich Kind war, spielte ich viel draußen.',
      'Als er ankam, war niemand da.',
      'Als wir nach Deutschland kamen, konnten wir kein Deutsch.',
      'Als sie das hörte, war sie überrascht.',
    ],
    topics: ['Vergangenheit', 'Erinnerungen', 'Erzählen'],
    difficulty: 4,
  },
  {
    id: 'b2-seit-bis',
    level: 'B2',
    name: 'Nebensatz mit "seit" / "bis"',
    pattern: 'seit/bis + Subjekt + ... + Verb (Ende)',
    explanation: '"Seit" beschreibt den Beginn, "bis" das Ende einer Zeitspanne.',
    examples: [
      'Seit ich in Deutschland bin, spreche ich besser Deutsch.',
      'Bis du kommst, warte ich hier.',
      'Seit er das neue Buch liest, ist er begeistert.',
      'Bis die Sonne untergeht, bleiben wir hier.',
    ],
    topics: ['Zeitspannen', 'Dauer', 'Warten'],
    difficulty: 4,
  },
  {
    id: 'b2-falls',
    level: 'B2',
    name: 'Nebensatz mit "falls"',
    pattern: 'falls + Subjekt + ... + Verb (Ende)',
    explanation: '"Falls" drückt eine unsichere Bedingung aus ("für den Fall, dass").',
    examples: [
      'Falls es regnet, bleiben wir zu Hause.',
      'Falls du Zeit hast, ruf mich an.',
      'Falls er nicht kommt, gehen wir ohne ihn.',
      'Falls Sie Fragen haben, fragen Sie mich.',
    ],
    topics: ['Bedingungen', 'Planung', 'Unsicherheit'],
    difficulty: 4,
  },
  {
    id: 'b2-indem',
    level: 'B2',
    name: 'Nebensatz mit "indem"',
    pattern: 'indem + Subjekt + ... + Verb (Ende)',
    explanation: '"Indem" beschreibt die Art und Weise oder das Mittel einer Handlung.',
    examples: [
      'Ich lerne Deutsch, indem ich viel spreche.',
      'Er verbessert seine Fitness, indem er jeden Tag läuft.',
      'Sie spart Geld, indem sie weniger ausgibt.',
      'Man kann viel lernen, indem man Fehler macht.',
    ],
    topics: ['Methoden', 'Mittel', 'Lernen'],
    difficulty: 5,
  },
  {
    id: 'b2-ohne-zu',
    level: 'B2',
    name: 'Infinitivsatz mit "ohne ... zu"',
    pattern: 'ohne ... zu + Infinitiv',
    explanation: '"Ohne ... zu" beschreibt, dass etwas nicht geschieht.',
    examples: [
      'Er geht, ohne zu fragen.',
      'Sie verlässt das Haus, ohne sich zu verabschieden.',
      'Ich esse, ohne zu kauen.',
      'Man kann nicht Deutsch lernen, ohne zu üben.',
    ],
    topics: ['Unterlassung', 'Gewohnheiten', 'Alltag'],
    difficulty: 5,
  },
  {
    id: 'b2-anstatt-zu',
    level: 'B2',
    name: 'Infinitivsatz mit "anstatt ... zu"',
    pattern: 'anstatt ... zu + Infinitiv',
    explanation: '"Anstatt ... zu" beschreibt eine Alternative, die nicht gewählt wurde.',
    examples: [
      'Er spielt, anstatt zu lernen.',
      'Sie geht spazieren, anstatt zu arbeiten.',
      'Ich lese, anstatt fernzusehen.',
      'Wir bleiben hier, anstatt wegzugehen.',
    ],
    topics: ['Alternativen', 'Entscheidungen', 'Kontraste'],
    difficulty: 5,
  },
  {
    id: 'b2-tekamolo',
    level: 'B2',
    name: 'TeKaMoLo (Zeitangaben, Kausalangaben, Modalangaben, Lokalangaben)',
    pattern: 'Zeit - Grund - Art - Ort',
    explanation: 'Die Reihenfolge von Angaben im Satz folgt oft der Regel TeKaMoLo.',
    examples: [
      'Gestern bin ich wegen des Wetters mit dem Zug nach Berlin gefahren.',
      'Morgen gehe ich aus Neugier schnell ins Museum.',
      'Heute arbeitet er wegen eines Projekts intensiv im Büro.',
      'Letzte Woche sind wir aus Spaß mit Freunden ins Kino gegangen.',
    ],
    topics: ['Satzbau', 'Komplexe Sätze', 'Stilistik'],
    difficulty: 5,
  },

  // C1 Level - Advanced
  {
    id: 'c1-je-desto',
    level: 'C1',
    name: 'Komparativsätze mit "je ... desto"',
    pattern: 'je + Komparativ ..., desto + Komparativ ...',
    explanation: '"Je ... desto" drückt einen proportionalen Zusammenhang aus.',
    examples: [
      'Je mehr ich übe, desto besser spreche ich.',
      'Je älter man wird, desto weiser wird man.',
      'Je schneller du läufst, desto früher kommst du an.',
      'Je mehr ich lerne, desto mehr verstehe ich.',
    ],
    topics: ['Vergleiche', 'Zusammenhänge', 'Logik'],
    difficulty: 5,
  },
  {
    id: 'c1-vorausgesetzt',
    level: 'C1',
    name: 'Nebensatz mit "vorausgesetzt (dass)"',
    pattern: 'vorausgesetzt (dass) + Subjekt + ... + Verb (Ende)',
    explanation: '"Vorausgesetzt (dass)" drückt eine notwendige Voraussetzung aus.',
    examples: [
      'Wir können morgen wandern gehen, vorausgesetzt das Wetter ist gut.',
      'Ich helfe dir, vorausgesetzt du hilfst mir auch.',
      'Das Projekt wird erfolgreich sein, vorausgesetzt dass alle mitarbeiten.',
      'Du kannst kommen, vorausgesetzt du bist pünktlich.',
    ],
    topics: ['Voraussetzungen', 'Bedingungen', 'Formelle Sprache'],
    difficulty: 5,
  },
  {
    id: 'c1-participial-construction',
    level: 'C1',
    name: 'Partizipialkonstruktionen',
    pattern: 'Partizip I/II als Adjektiv/Phrase',
    explanation: 'Partizipien können als erweiterte Adjektive oder als Phrasen verwendet werden.',
    examples: [
      'Das schnell gelesene Buch war interessant.',
      'Die lachenden Kinder spielten im Garten.',
      'Der gut durchdachte Plan wurde umgesetzt.',
      'Die an der Tafel schreibende Lehrerin erklärte die Grammatik.',
    ],
    topics: ['Stilistik', 'Formelle Sprache', 'Komplexe Beschreibungen'],
    difficulty: 5,
  },
  {
    id: 'c1-multiple-subordinates',
    level: 'C1',
    name: 'Mehrfache Nebensätze',
    pattern: 'Hauptsatz + Nebensatz 1 + Nebensatz 2 + ...',
    explanation: 'Komplexe Sätze können mehrere verschachtelte Nebensätze enthalten.',
    examples: [
      'Der Grund, aus dem ich gekommen bin, obwohl ich müde war, ist wichtig.',
      'Ich denke, dass der Mann, den du gestern gesehen hast, mein Lehrer ist.',
      'Sie sagt, dass sie kommt, wenn sie Zeit hat und es nicht regnet.',
      'Er glaubt, dass das Buch, das ich lese, das beste ist, das je geschrieben wurde.',
    ],
    topics: ['Komplexe Sätze', 'Akademische Sprache', 'Argumentation'],
    difficulty: 5,
  },
  {
    id: 'c1-konjunktiv2-advanced',
    level: 'C1',
    name: 'Konjunktiv II (komplexe Formen)',
    pattern: 'hätte/wäre + ... + Partizip II',
    explanation: 'Der Konjunktiv II in der Vergangenheit drückt irreale Bedingungen aus.',
    examples: [
      'Wenn ich früher gewusst hätte, wäre ich gekommen.',
      'Hätte sie mehr gelernt, hätte sie die Prüfung bestanden.',
      'Wäre er vorsichtiger gewesen, hätte er den Unfall vermieden.',
      'Wenn wir mehr Zeit gehabt hätten, hätten wir alles gesehen.',
    ],
    topics: ['Irreale Bedingungen', 'Reue', 'Hypothetisches'],
    difficulty: 5,
  },
  {
    id: 'c1-flexible-inversion',
    level: 'C1',
    name: 'Flexible Inversion (Betonung)',
    pattern: 'Betontes Element (Position 1) + Verb + Subjekt + ...',
    explanation: 'Durch Umstellung kann man verschiedene Elemente betonen.',
    examples: [
      'Glücklich bin ich nur, wenn ich schreibe.',
      'Niemals würde ich das tun.',
      'Gestern erst habe ich das erfahren.',
      'Nur selten sieht man so etwas.',
    ],
    topics: ['Stilistik', 'Betonung', 'Rhetorik'],
    difficulty: 5,
  },

  // C2 Level - Proficient
  {
    id: 'c2-highly-embedded',
    level: 'C2',
    name: 'Hochgradig verschachtelte Sätze',
    pattern: 'Mehrere Ebenen von Nebensätzen',
    explanation: 'Sehr komplexe Satzstrukturen mit mehreren Einbettungsebenen.',
    examples: [
      'Ich glaube, dass der Grund, warum er, obwohl er es versprochen hatte, nicht gekommen ist, darin liegt, dass er vergessen hat, was er gesagt hat.',
      'Das Buch, das der Autor, den ich gestern getroffen habe, geschrieben hat, ist eines, das ich jedem empfehlen würde, der sich für Geschichte interessiert.',
    ],
    topics: ['Akademische Sprache', 'Literatur', 'Komplexe Argumentation'],
    difficulty: 5,
  },
  {
    id: 'c2-insofern-als',
    level: 'C2',
    name: 'Gehobene Konnektoren',
    pattern: 'insofern als / geschweige denn / es sei denn',
    explanation: 'Fortgeschrittene Konnektoren für nuancierte Ausdrücke.',
    examples: [
      'Das ist richtig, insofern als es die Fakten betrifft.',
      'Ich kann nicht einmal laufen, geschweige denn rennen.',
      'Ich komme, es sei denn, es regnet stark.',
      'Er hilft gerne, insofern er Zeit hat.',
    ],
    topics: ['Formelle Sprache', 'Akademisch', 'Nuancen'],
    difficulty: 5,
  },
  {
    id: 'c2-ellipsis',
    level: 'C2',
    name: 'Ellipsen und Auslassungen',
    pattern: 'Weglassen von Elementen für Eleganz',
    explanation: 'Stilistische Auslassungen von Satzteilen, die aus dem Kontext klar sind.',
    examples: [
      'Ich gehe nach Berlin, du nach München.',
      'Er trinkt Kaffee, sie Tee.',
      'Manche lieben es, andere hassen es.',
      'Hier ein Vorschlag, dort eine Kritik.',
    ],
    topics: ['Stilistik', 'Rhetorik', 'Eleganz'],
    difficulty: 5,
  },
  {
    id: 'c2-participial-phrases',
    level: 'C2',
    name: 'Partizipial- und Infinitivphrasen (formal)',
    pattern: 'Erweiterte Partizipial- und Infinitivkonstruktionen',
    explanation: 'Komplexe Partizipial- und Infinitivphrasen in formellen Texten.',
    examples: [
      'Angesichts der Situation handelnd, entschied er sich für einen Kompromiss.',
      'Den Umständen entsprechend reagiert die Regierung mit neuen Maßnahmen.',
      'Unter Berücksichtigung aller Faktoren ergibt sich folgendes Bild.',
      'Die Konsequenzen bedenkend, wählte sie den sichereren Weg.',
    ],
    topics: ['Formelle Sprache', 'Akademisch', 'Berichte'],
    difficulty: 5,
  },
  {
    id: 'c2-rhetorical-variations',
    level: 'C2',
    name: 'Rhetorische Variationen',
    pattern: 'Verschiedene Satzstrukturen für rhetorische Wirkung',
    explanation: 'Bewusste Variation der Satzstruktur für stilistische und rhetorische Effekte.',
    examples: [
      'Nicht das, was er sagte, sondern wie er es sagte, überzeugte mich.',
      'Selten habe ich eine derart überzeugende Argumentation gehört.',
      'Mag sein, dass er recht hat; dennoch zweifle ich.',
      'Erst als alles vorbei war, erkannte sie die Wahrheit.',
    ],
    topics: ['Rhetorik', 'Argumentation', 'Literatur'],
    difficulty: 5,
  },
  {
    id: 'c2-konjunktiv1-formal',
    level: 'C2',
    name: 'Konjunktiv I (indirekte Rede)',
    pattern: 'Er sagt/sagte, ... + Konjunktiv I',
    explanation: 'Konjunktiv I wird in formellen Kontexten für indirekte Rede verwendet.',
    examples: [
      'Er sagt, er komme morgen.',
      'Sie behauptet, sie habe nichts gewusst.',
      'Der Minister erklärt, man müsse die Situation neu bewerten.',
      'Die Zeitung berichtet, der Präsident sei zurückgetreten.',
    ],
    topics: ['Formelle Sprache', 'Journalismus', 'Indirekte Rede'],
    difficulty: 5,
  },
]

export function getStructuresByLevel(level: CEFRLevel): GrammarStructure[] {
  return grammarStructures.filter((s) => s.level === level)
}

export function getStructureById(id: string): GrammarStructure | undefined {
  return grammarStructures.find((s) => s.id === id)
}

export function getLevelOrder(level: CEFRLevel): number {
  const order: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 }
  return order[level]
}

export function getAllLevels(): CEFRLevel[] {
  return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
}
