export interface Database {
  public: {
    Tables: {
      words: {
        Row: Word
        Insert: Partial<Word> & Pick<Word, 'word'>
        Update: Partial<Word>
      }
      definitions: {
        Row: Definition
        Insert: Partial<Definition> & Pick<Definition, 'word_id' | 'text'>
        Update: Partial<Definition>
      }
      examples: {
        Row: Example
        Insert: Partial<Example> & Pick<Example, 'word_id' | 'text'>
        Update: Partial<Example>
      }
      generated_images: {
        Row: GeneratedImage
        Insert: Omit<GeneratedImage, 'id' | 'created_at'>
        Update: Partial<Omit<GeneratedImage, 'id'>>
      }
      user_favorites: {
        Row: UserFavorite
        Insert: Omit<UserFavorite, 'id' | 'created_at'>
        Update: Partial<Omit<UserFavorite, 'id'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export interface Word {
  id: string
  word: string
  pronunciation: string
  syllables: string
  word_type: string
  category: string
  difficulty: number // 1-5
  audio_url?: string
  synonyms: string[]
  antonyms: string[]
  created_at: string
}

export interface Definition {
  id: string
  word_id: string
  text: string
  order: number
}

export interface Example {
  id: string
  word_id: string
  text: string
  highlighted_word: string
  image_url?: string
  order: number
}

export interface GeneratedImage {
  id: string
  example_id: string
  prompt: string
  url: string
  created_at: string
}

export interface DictionaryEntry {
  word: Word
  definitions: Definition[]
  examples: Example[]
}

export interface UserFavorite {
  id: string
  user_id: string
  word_id: string
  word: string
  created_at: string
}
