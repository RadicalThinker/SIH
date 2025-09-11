import Dexie, { Table } from 'dexie'
import { Lesson, Game, Progress, GameScore, Badge } from '@types/index'

// Offline database interfaces
export interface OfflineLesson extends Omit<Lesson, '_id' | 'createdAt' | 'updatedAt'> {
  id: string
  lastUpdated: Date
  downloadedAt: Date
  language: 'en' | 'hi' | 'or'
}

export interface OfflineGame extends Omit<Game, '_id' | 'createdAt' | 'updatedAt'> {
  id: string
  lastUpdated: Date
  downloadedAt: Date
  assetsDownloaded: boolean
}

export interface OfflineProgress extends Omit<Progress, '_id' | 'createdAt' | 'updatedAt'> {
  id: string
  synced: boolean
  lastModified: Date
}

export interface OfflineGameScore extends Omit<GameScore, '_id' | 'timestamp'> {
  id: string
  timestamp: Date
  synced: boolean
}

export interface OfflineBadge extends Omit<Badge, '_id'> {
  id: string
  synced: boolean
}

export interface SyncMetadata {
  id: string
  lastSyncTimestamp: Date
  studentId: string
  pendingUploads: number
  totalOfflineSize: number
}

export interface CachedAsset {
  id: string
  url: string
  blob: Blob
  mimeType: string
  size: number
  downloadedAt: Date
  lastAccessed: Date
}

class OfflineDatabase extends Dexie {
  // Tables
  lessons!: Table<OfflineLesson>
  games!: Table<OfflineGame>
  progress!: Table<OfflineProgress>
  gameScores!: Table<OfflineGameScore>
  badges!: Table<OfflineBadge>
  syncMetadata!: Table<SyncMetadata>
  cachedAssets!: Table<CachedAsset>

  constructor() {
    super('RuralEducationDB')
    
    this.version(1).stores({
      lessons: 'id, subjectId, grade, language, isOfflineAvailable, lastUpdated, downloadedAt',
      games: 'id, subject, *grade, difficulty, isOfflineAvailable, assetsDownloaded, lastUpdated',
      progress: 'id, studentId, lessonId, gameId, type, status, synced, lastModified',
      gameScores: 'id, studentId, gameId, score, timestamp, synced',
      badges: 'id, studentId, achievementId, synced',
      syncMetadata: 'id, studentId, lastSyncTimestamp',
      cachedAssets: 'id, url, size, downloadedAt, lastAccessed'
    })

    // Hooks for automatic cleanup and maintenance
    this.cachedAssets.hook('creating', (primKey, obj, trans) => {
      obj.lastAccessed = new Date()
    })

    this.cachedAssets.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.lastAccessed = new Date()
    })
  }

  // Lesson management
  async downloadLesson(lesson: Lesson, language: 'en' | 'hi' | 'or' = 'en'): Promise<void> {
    const offlineLesson: OfflineLesson = {
      ...lesson,
      id: lesson._id,
      language,
      lastUpdated: lesson.updatedAt,
      downloadedAt: new Date()
    }
    
    await this.lessons.put(offlineLesson)
    
    // Download associated assets
    await this.downloadLessonAssets(lesson)
  }

  async downloadLessonAssets(lesson: Lesson): Promise<void> {
    const assets = [
      ...lesson.content.images.map(img => img.url),
      ...lesson.content.videos.map(vid => vid.url)
    ]

    for (const assetUrl of assets) {
      try {
        const response = await fetch(assetUrl)
        if (response.ok) {
          const blob = await response.blob()
          await this.cachedAssets.put({
            id: `asset_${Date.now()}_${Math.random()}`,
            url: assetUrl,
            blob,
            mimeType: blob.type,
            size: blob.size,
            downloadedAt: new Date(),
            lastAccessed: new Date()
          })
        }
      } catch (error) {
        console.warn(`Failed to download asset: ${assetUrl}`, error)
      }
    }
  }

  async getOfflineLessons(grade?: number, subject?: string): Promise<OfflineLesson[]> {
    let query = this.lessons.toCollection()
    
    if (grade) {
      query = query.filter(lesson => lesson.grade === grade)
    }
    
    if (subject) {
      query = query.filter(lesson => lesson.subjectId === subject)
    }
    
    return query.toArray()
  }

  // Game management
  async downloadGame(game: Game): Promise<void> {
    const offlineGame: OfflineGame = {
      ...game,
      id: game._id,
      lastUpdated: game.updatedAt,
      downloadedAt: new Date(),
      assetsDownloaded: false
    }
    
    await this.games.put(offlineGame)
    
    // Download game assets in background
    this.downloadGameAssets(game).then(() => {
      this.games.update(game._id, { assetsDownloaded: true })
    })
  }

  async downloadGameAssets(game: Game): Promise<void> {
    const assets = [
      game.assets.bundle,
      ...game.assets.images,
      ...game.assets.sounds,
      ...game.assets.data
    ]

    for (const assetUrl of assets) {
      try {
        const response = await fetch(assetUrl)
        if (response.ok) {
          const blob = await response.blob()
          await this.cachedAssets.put({
            id: `game_asset_${Date.now()}_${Math.random()}`,
            url: assetUrl,
            blob,
            mimeType: blob.type,
            size: blob.size,
            downloadedAt: new Date(),
            lastAccessed: new Date()
          })
        }
      } catch (error) {
        console.warn(`Failed to download game asset: ${assetUrl}`, error)
      }
    }
  }

  async getOfflineGames(grade?: number, subject?: string): Promise<OfflineGame[]> {
    let query = this.games.toCollection()
    
    if (grade) {
      query = query.filter(game => game.grade.includes(grade))
    }
    
    if (subject) {
      query = query.filter(game => game.subject === subject)
    }
    
    return query.toArray()
  }

  // Progress tracking
  async saveProgress(progress: Partial<Progress>): Promise<string> {
    const offlineProgress: OfflineProgress = {
      ...progress as Progress,
      id: progress._id || `progress_${Date.now()}_${Math.random()}`,
      synced: false,
      lastModified: new Date()
    }
    
    await this.progress.put(offlineProgress)
    return offlineProgress.id
  }

  async saveGameScore(gameScore: Partial<GameScore>): Promise<string> {
    const offlineGameScore: OfflineGameScore = {
      ...gameScore as GameScore,
      id: gameScore._id || `score_${Date.now()}_${Math.random()}`,
      timestamp: gameScore.timestamp || new Date(),
      synced: false
    }
    
    await this.gameScores.put(offlineGameScore)
    return offlineGameScore.id
  }

  async getUnsyncedProgress(): Promise<OfflineProgress[]> {
    return this.progress.where('synced').equals(false).toArray()
  }

  async getUnsyncedGameScores(): Promise<OfflineGameScore[]> {
    return this.gameScores.where('synced').equals(false).toArray()
  }

  // Sync management
  async markAsSynced(type: 'progress' | 'gameScore' | 'badge', id: string): Promise<void> {
    switch (type) {
      case 'progress':
        await this.progress.update(id, { synced: true })
        break
      case 'gameScore':
        await this.gameScores.update(id, { synced: true })
        break
      case 'badge':
        await this.badges.update(id, { synced: true })
        break
    }
  }

  async updateSyncMetadata(studentId: string): Promise<void> {
    const metadata: SyncMetadata = {
      id: `sync_${studentId}`,
      studentId,
      lastSyncTimestamp: new Date(),
      pendingUploads: await this.getPendingUploadsCount(),
      totalOfflineSize: await this.getTotalOfflineSize()
    }
    
    await this.syncMetadata.put(metadata)
  }

  async getPendingUploadsCount(): Promise<number> {
    const [progressCount, scoresCount, badgesCount] = await Promise.all([
      this.progress.where('synced').equals(false).count(),
      this.gameScores.where('synced').equals(false).count(),
      this.badges.where('synced').equals(false).count()
    ])
    
    return progressCount + scoresCount + badgesCount
  }

  async getTotalOfflineSize(): Promise<number> {
    const assets = await this.cachedAssets.toArray()
    return assets.reduce((total, asset) => total + asset.size, 0)
  }

  // Asset management
  async getCachedAsset(url: string): Promise<Blob | null> {
    const asset = await this.cachedAssets.where('url').equals(url).first()
    if (asset) {
      // Update last accessed time
      await this.cachedAssets.update(asset.id, { lastAccessed: new Date() })
      return asset.blob
    }
    return null
  }

  async cleanupOldAssets(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    const cutoffDate = new Date(Date.now() - maxAge)
    await this.cachedAssets.where('lastAccessed').below(cutoffDate).delete()
  }

  async getStorageUsage(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0
      }
    }
    
    // Fallback: calculate from cached assets
    const totalSize = await this.getTotalOfflineSize()
    return {
      used: totalSize,
      available: 100 * 1024 * 1024 // 100MB fallback
    }
  }

  // Cleanup and maintenance
  async clearAllData(): Promise<void> {
    await Promise.all([
      this.lessons.clear(),
      this.games.clear(),
      this.progress.clear(),
      this.gameScores.clear(),
      this.badges.clear(),
      this.cachedAssets.clear(),
      this.syncMetadata.clear()
    ])
  }

  async clearUserData(studentId: string): Promise<void> {
    await Promise.all([
      this.progress.where('studentId').equals(studentId).delete(),
      this.gameScores.where('studentId').equals(studentId).delete(),
      this.badges.where('studentId').equals(studentId).delete(),
      this.syncMetadata.where('studentId').equals(studentId).delete()
    ])
  }
}

// Create and export database instance
export const offlineDB = new OfflineDatabase()

// Database utilities
export const dbUtils = {
  async isOnline(): Promise<boolean> {
    return navigator.onLine
  },

  async waitForOnline(): Promise<void> {
    if (navigator.onLine) return
    
    return new Promise((resolve) => {
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline)
        resolve()
      }
      window.addEventListener('online', handleOnline)
    })
  },

  async getOfflineCapabilities(): Promise<{
    canDownloadLessons: boolean
    canDownloadGames: boolean
    storageAvailable: number
  }> {
    const storage = await offlineDB.getStorageUsage()
    const availableSpace = storage.available - storage.used
    
    return {
      canDownloadLessons: availableSpace > 10 * 1024 * 1024, // 10MB minimum
      canDownloadGames: availableSpace > 50 * 1024 * 1024, // 50MB minimum
      storageAvailable: availableSpace
    }
  }
}
