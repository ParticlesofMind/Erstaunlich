/**
 * Hook for tracking grammar structure learning progress
 */

import { useState, useEffect } from 'react'
import type { CEFRLevel } from '../data/grammarStructures'

export interface StructureProgress {
  structureId: string
  level: CEFRLevel
  attempts: number
  successes: number
  lastPracticed: string
  mastered: boolean
}

export interface UserProgress {
  currentLevel: CEFRLevel
  structures: StructureProgress[]
  totalSentences: number
  totalTrainingSessions: number
  lastActive: string
}

const STORAGE_KEY = 'erstaunlich_grammar_progress'

/**
 * Load progress from localStorage
 */
function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading progress:', error)
  }
  
  // Default initial progress
  return {
    currentLevel: 'A1',
    structures: [],
    totalSentences: 0,
    totalTrainingSessions: 0,
    lastActive: new Date().toISOString(),
  }
}

/**
 * Save progress to localStorage
 */
function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving progress:', error)
  }
}

/**
 * Hook for managing grammar structure progress
 */
export function useGrammarProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress)

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  /**
   * Record a structure attempt
   */
  const recordAttempt = (structureId: string, level: CEFRLevel, success: boolean) => {
    setProgress((prev) => {
      const structures = [...prev.structures]
      const existingIndex = structures.findIndex((s) => s.structureId === structureId)

      if (existingIndex >= 0) {
        // Update existing record
        const existing = structures[existingIndex]
        structures[existingIndex] = {
          ...existing,
          attempts: existing.attempts + 1,
          successes: success ? existing.successes + 1 : existing.successes,
          lastPracticed: new Date().toISOString(),
          mastered: success && existing.successes + 1 >= 20, // 20 successful attempts = mastered
        }
      } else {
        // Create new record
        structures.push({
          structureId,
          level,
          attempts: 1,
          successes: success ? 1 : 0,
          lastPracticed: new Date().toISOString(),
          mastered: false,
        })
      }

      return {
        ...prev,
        structures,
        totalSentences: prev.totalSentences + 1,
        lastActive: new Date().toISOString(),
      }
    })
  }

  /**
   * Complete a training session
   */
  const completeTrainingSession = () => {
    setProgress((prev) => ({
      ...prev,
      totalTrainingSessions: prev.totalTrainingSessions + 1,
      lastActive: new Date().toISOString(),
    }))
  }

  /**
   * Update user's current level
   */
  const updateLevel = (level: CEFRLevel) => {
    setProgress((prev) => ({
      ...prev,
      currentLevel: level,
      lastActive: new Date().toISOString(),
    }))
  }

  /**
   * Get progress for a specific structure
   */
  const getStructureProgress = (structureId: string): StructureProgress | null => {
    return progress.structures.find((s) => s.structureId === structureId) || null
  }

  /**
   * Get mastered structures for a level
   */
  const getMasteredStructures = (level?: CEFRLevel): StructureProgress[] => {
    return progress.structures.filter(
      (s) => s.mastered && (level ? s.level === level : true)
    )
  }

  /**
   * Get accuracy for a structure
   */
  const getStructureAccuracy = (structureId: string): number => {
    const structureProgress = getStructureProgress(structureId)
    if (!structureProgress || structureProgress.attempts === 0) return 0
    return Math.round((structureProgress.successes / structureProgress.attempts) * 100)
  }

  /**
   * Reset all progress (for testing or user request)
   */
  const resetProgress = () => {
    const defaultProgress: UserProgress = {
      currentLevel: 'A1',
      structures: [],
      totalSentences: 0,
      totalTrainingSessions: 0,
      lastActive: new Date().toISOString(),
    }
    setProgress(defaultProgress)
    saveProgress(defaultProgress)
  }

  /**
   * Get statistics for a level
   */
  const getLevelStats = (level: CEFRLevel) => {
    const levelStructures = progress.structures.filter((s) => s.level === level)
    const mastered = levelStructures.filter((s) => s.mastered).length
    const total = levelStructures.length

    return {
      total,
      mastered,
      inProgress: total - mastered,
      accuracy:
        total > 0
          ? Math.round(
              levelStructures.reduce((acc, s) => {
                return acc + (s.attempts > 0 ? s.successes / s.attempts : 0)
              }, 0) / total * 100
            )
          : 0,
    }
  }

  return {
    progress,
    recordAttempt,
    completeTrainingSession,
    updateLevel,
    getStructureProgress,
    getMasteredStructures,
    getStructureAccuracy,
    resetProgress,
    getLevelStats,
  }
}
