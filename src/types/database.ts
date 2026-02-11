export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      definitions: {
        Row: {
          id: string
          order: number
          text: string
          word_id: string
        }
        Insert: {
          id: string
          order?: number
          text: string
          word_id: string
        }
        Update: {
          id?: string
          order?: number
          text?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "definitions_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      examples: {
        Row: {
          highlighted_word: string
          id: string
          image_prompt: string | null
          image_url: string | null
          order: number
          text: string
          word_id: string
        }
        Insert: {
          highlighted_word?: string
          id: string
          image_prompt?: string | null
          image_url?: string | null
          order?: number
          text: string
          word_id: string
        }
        Update: {
          highlighted_word?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          order?: number
          text?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "examples_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images: {
        Row: {
          created_at: string
          example_id: string | null
          id: string
          prompt: string
          url: string
        }
        Insert: {
          created_at?: string
          example_id?: string | null
          id?: string
          prompt: string
          url: string
        }
        Update: {
          created_at?: string
          example_id?: string | null
          id?: string
          prompt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "examples"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          word: string
          word_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          word: string
          word_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          word?: string
          word_id?: string
        }
        Relationships: []
      }
      words: {
        Row: {
          antonyms: string[]
          audio_url: string | null
          category: string
          created_at: string
          difficulty: number
          id: string
          pronunciation: string
          source: string
          syllables: string
          synonyms: string[]
          updated_at: string
          word: string
          word_type: string
        }
        Insert: {
          antonyms?: string[]
          audio_url?: string | null
          category?: string
          created_at?: string
          difficulty?: number
          id: string
          pronunciation?: string
          source?: string
          syllables?: string
          synonyms?: string[]
          updated_at?: string
          word: string
          word_type?: string
        }
        Update: {
          antonyms?: string[]
          audio_url?: string | null
          category?: string
          created_at?: string
          difficulty?: number
          id?: string
          pronunciation?: string
          source?: string
          syllables?: string
          synonyms?: string[]
          updated_at?: string
          word?: string
          word_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ── Convenience aliases used throughout the app ──

export interface Word {
  id: string
  word: string
  pronunciation: string
  syllables: string
  word_type: string
  category: string
  difficulty: number
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
