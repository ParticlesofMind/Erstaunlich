-- Erstaunlich Dictionary Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Words table
create table if not exists public.words (
  id text primary key,
  word text not null,
  pronunciation text not null default '',
  syllables text not null default '',
  word_type text not null default '',
  category text not null default '',
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  audio_url text,
  synonyms text[] not null default '{}',
  antonyms text[] not null default '{}',
  source text not null default 'wiktionary', -- 'wiktionary', 'manual', 'ai'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Definitions table
create table if not exists public.definitions (
  id text primary key,
  word_id text not null references public.words(id) on delete cascade,
  text text not null,
  "order" integer not null default 1
);

-- Examples table
create table if not exists public.examples (
  id text primary key,
  word_id text not null references public.words(id) on delete cascade,
  text text not null,
  highlighted_word text not null default '',
  image_url text,
  image_prompt text, -- The prompt used to generate the AI image
  "order" integer not null default 1
);

-- Generated images tracking
create table if not exists public.generated_images (
  id uuid primary key default uuid_generate_v4(),
  example_id text references public.examples(id) on delete cascade,
  prompt text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_words_word on public.words (word);
create index if not exists idx_words_source on public.words (source);
create index if not exists idx_definitions_word_id on public.definitions (word_id);
create index if not exists idx_examples_word_id on public.examples (word_id);
create index if not exists idx_generated_images_example on public.generated_images (example_id);

-- Full-text search index
create index if not exists idx_words_fts on public.words using gin (to_tsvector('german', word));

-- Enable Row Level Security
alter table public.words enable row level security;
alter table public.definitions enable row level security;
alter table public.examples enable row level security;
alter table public.generated_images enable row level security;

-- Public read access policies
create policy "Public read access" on public.words for select using (true);
create policy "Public read access" on public.definitions for select using (true);
create policy "Public read access" on public.examples for select using (true);
create policy "Public read access" on public.generated_images for select using (true);

-- Public write for caching (in production, restrict to authenticated users)
create policy "Public insert for caching" on public.words for insert with check (true);
create policy "Public insert for caching" on public.definitions for insert with check (true);
create policy "Public insert for caching" on public.examples for insert with check (true);
create policy "Public insert for caching" on public.generated_images for insert with check (true);

-- Create storage bucket for AI-generated images
insert into storage.buckets (id, name, public)
values ('dictionary-images', 'dictionary-images', true)
on conflict do nothing;

-- User favorites table (linked to Supabase Auth)
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  word text not null,
  created_at timestamptz not null default now(),
  unique(user_id, word_id)
);

create index if not exists idx_user_favorites_user on public.user_favorites (user_id);
create index if not exists idx_user_favorites_word on public.user_favorites (word_id);

alter table public.user_favorites enable row level security;

create policy "Users can view own favorites"
  on public.user_favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites"
  on public.user_favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites"
  on public.user_favorites for delete using (auth.uid() = user_id);

-- Chat messages table (for writing assistant)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_user on public.chat_messages (user_id);
create index if not exists idx_chat_messages_created on public.chat_messages (created_at);

alter table public.chat_messages enable row level security;

create policy "Users can view own chat messages"
  on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own chat messages"
  on public.chat_messages for insert with check (auth.uid() = user_id);
create policy "Users can delete own chat messages"
  on public.chat_messages for delete using (auth.uid() = user_id);

-- Chat conversations table (optional, for organizing multiple chat sessions)
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_conversations_user on public.chat_conversations (user_id);
create index if not exists idx_chat_conversations_updated on public.chat_conversations (updated_at);

alter table public.chat_conversations enable row level security;

create policy "Users can view own conversations"
  on public.chat_conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations"
  on public.chat_conversations for insert with check (auth.uid() = user_id);
create policy "Users can update own conversations"
  on public.chat_conversations for update using (auth.uid() = user_id);
create policy "Users can delete own conversations"
  on public.chat_conversations for delete using (auth.uid() = user_id);
