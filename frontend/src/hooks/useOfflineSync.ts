import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { offlineDB, dbUtils } from '@/db/offlineDB'
import { RootState } from '@store/index'
import toast from 'react-hot-toast'

interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  pendingUploads: number
  lastSyncTime: Date | null
  syncError: string | null
}

export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingUploads: 0,
    lastSyncTime: null,
    syncError: null
  })

  const { user } = useSelector((state: RootState) => state.auth)

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true, syncError: null }))
      if (user) {
        syncData()
      }
    }

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user])

  // Check pending uploads on mount
  useEffect(() => {
    if (user) {
      checkPendingUploads()
    }
  }, [user])

  const checkPendingUploads = useCallback(async () => {
    try {
      const count = await offlineDB.getPendingUploadsCount()
      setSyncStatus(prev => ({ ...prev, pendingUploads: count }))
    } catch (error) {
      console.error('Error checking pending uploads:', error)
    }
  }, [])

  const syncData = useCallback(async () => {
    if (!user || !navigator.onLine || syncStatus.isSyncing) {
      return
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncError: null }))

    try {
      // Sync progress data
      const unsyncedProgress = await offlineDB.getUnsyncedProgress()
      for (const progress of unsyncedProgress) {
        try {
          const response = await fetch('/api/progress/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              entries: [progress]
            })
          })

          if (response.ok) {
            await offlineDB.markAsSynced('progress', progress.id)
          }
        } catch (error) {
          console.error('Failed to sync progress:', error)
        }
      }

      // Sync game scores
      const unsyncedScores = await offlineDB.getUnsyncedGameScores()
      for (const score of unsyncedScores) {
        try {
          const response = await fetch(`/api/games/${score.gameId}/score`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(score)
          })

          if (response.ok) {
            await offlineDB.markAsSynced('gameScore', score.id)
          }
        } catch (error) {
          console.error('Failed to sync game score:', error)
        }
      }

      // Update sync metadata
      if (user.id) {
        await offlineDB.updateSyncMetadata(user.id)
      }

      // Update status
      await checkPendingUploads()
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date()
      }))

      toast.success('Data synced successfully')
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Sync failed'
      }))
      toast.error('Failed to sync data')
    }
  }, [user, syncStatus.isSyncing, checkPendingUploads])

  const downloadContent = useCallback(async (
    type: 'lesson' | 'game',
    id: string,
    options?: { language?: 'en' | 'hi' | 'or' }
  ) => {
    try {
      const capabilities = await dbUtils.getOfflineCapabilities()
      
      if (type === 'lesson' && !capabilities.canDownloadLessons) {
        throw new Error('Not enough storage space for lessons')
      }
      
      if (type === 'game' && !capabilities.canDownloadGames) {
        throw new Error('Not enough storage space for games')
      }

      const response = await fetch(`/api/content/${type}s/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`)
      }

      const content = await response.json()

      if (type === 'lesson') {
        await offlineDB.downloadLesson(content.data, options?.language)
      } else {
        await offlineDB.downloadGame(content.data)
      }

      toast.success(`${type} downloaded for offline use`)
    } catch (error) {
      console.error(`Failed to download ${type}:`, error)
      toast.error(`Failed to download ${type}`)
      throw error
    }
  }, [])

  const saveOfflineProgress = useCallback(async (progressData: any) => {
    try {
      await offlineDB.saveProgress(progressData)
      await checkPendingUploads()
      
      // Try to sync immediately if online
      if (navigator.onLine) {
        syncData()
      }
    } catch (error) {
      console.error('Failed to save offline progress:', error)
      throw error
    }
  }, [syncData, checkPendingUploads])

  const saveOfflineGameScore = useCallback(async (scoreData: any) => {
    try {
      await offlineDB.saveGameScore(scoreData)
      await checkPendingUploads()
      
      // Try to sync immediately if online
      if (navigator.onLine) {
        syncData()
      }
    } catch (error) {
      console.error('Failed to save offline game score:', error)
      throw error
    }
  }, [syncData, checkPendingUploads])

  const getOfflineContent = useCallback(async (
    type: 'lessons' | 'games',
    filters?: { grade?: number; subject?: string }
  ) => {
    try {
      if (type === 'lessons') {
        return await offlineDB.getOfflineLessons(filters?.grade, filters?.subject)
      } else {
        return await offlineDB.getOfflineGames(filters?.grade, filters?.subject)
      }
    } catch (error) {
      console.error(`Failed to get offline ${type}:`, error)
      return []
    }
  }, [])

  const clearOfflineData = useCallback(async () => {
    try {
      if (user?.id) {
        await offlineDB.clearUserData(user.id)
      } else {
        await offlineDB.clearAllData()
      }
      await checkPendingUploads()
      toast.success('Offline data cleared')
    } catch (error) {
      console.error('Failed to clear offline data:', error)
      toast.error('Failed to clear offline data')
    }
  }, [user, checkPendingUploads])

  const getStorageInfo = useCallback(async () => {
    try {
      return await offlineDB.getStorageUsage()
    } catch (error) {
      console.error('Failed to get storage info:', error)
      return { used: 0, available: 0 }
    }
  }, [])

  return {
    syncStatus,
    syncData,
    downloadContent,
    saveOfflineProgress,
    saveOfflineGameScore,
    getOfflineContent,
    clearOfflineData,
    getStorageInfo,
    checkPendingUploads
  }
}
