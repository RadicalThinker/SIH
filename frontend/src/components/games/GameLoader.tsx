import { useState, useEffect, Suspense, lazy } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Game } from '@types/index'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
// If ErrorBoundary exists elsewhere, update the path accordingly, for example:
import ErrorBoundary from '@/components/ui/ErrorBoundary'
// Or, if the file does not exist, create it at src/components/ui/ErrorBoundary.tsx with a basic implementation:
import { useOfflineSync } from '@hooks/useOfflineSync'
import toast from 'react-hot-toast'

// Game component cache to avoid re-importing
const gameComponentCache = new Map<string, React.ComponentType<any>>()

interface GameLoaderProps {
  gameId?: string
  onGameComplete?: (score: number, timeSpent: number) => void
  onGameExit?: () => void
}

const GameLoader: React.FC<GameLoaderProps> = ({
  gameId: propGameId,
  onGameComplete,
  onGameExit
}) => {
  const { gameId: paramGameId } = useParams<{ gameId: string }>()
  const gameId = propGameId || paramGameId
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { saveOfflineGameScore, syncStatus } = useOfflineSync()

  const [game, setGame] = useState<Game | null>(null)
  const [gameComponent, setGameComponent] = useState<React.ComponentType<any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [gameStartTime] = useState(Date.now())

  useEffect(() => {
    if (gameId) {
      loadGame(gameId)
    }
  }, [gameId])

  const loadGame = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Check if game component is already cached
      if (gameComponentCache.has(id)) {
        const cachedComponent = gameComponentCache.get(id)!
        setGameComponent(cachedComponent)
        setLoading(false)
        return
      }

      // Fetch game metadata
      const gameResponse = await fetch(`/api/games/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!gameResponse.ok) {
        throw new Error('Failed to load game metadata')
      }

      const gameData = await gameResponse.json()
      setGame(gameData.data)

      // Check if game assets are available offline
      const offlineAssets = await checkOfflineAssets(gameData.data)
      
      if (offlineAssets) {
        // Load from offline storage
        await loadGameFromOffline(gameData.data)
      } else {
        // Download and load game dynamically
        await loadGameDynamically(gameData.data)
      }

    } catch (err) {
      console.error('Failed to load game:', err)
      setError(err instanceof Error ? err.message : 'Failed to load game')
      toast.error(t('game.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const checkOfflineAssets = async (gameData: Game): Promise<boolean> => {
    try {
      // Check if game bundle exists in cache
      const response = await fetch(gameData.assets.bundle, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const loadGameFromOffline = async (gameData: Game) => {
    try {
      // Load game component from offline assets
      const GameComponent = await importGameComponent(gameData.id, gameData.assets.bundle)
      setGameComponent(GameComponent)
      gameComponentCache.set(gameData.id, GameComponent)
    } catch (error) {
      throw new Error('Failed to load offline game')
    }
  }

  const loadGameDynamically = async (gameData: Game) => {
    try {
      // Download game assets with progress tracking
      await downloadGameAssets(gameData)
      
      // Import game component
      const GameComponent = await importGameComponent(gameData.id, gameData.assets.bundle)
      setGameComponent(GameComponent)
      gameComponentCache.set(gameData.id, GameComponent)
      
    } catch (error) {
      throw new Error('Failed to download and load game')
    }
  }

  const downloadGameAssets = async (gameData: Game) => {
    const assets = [
      gameData.assets.bundle,
      ...gameData.assets.images,
      ...gameData.assets.sounds,
      ...gameData.assets.data
    ]

    let downloadedCount = 0
    const totalAssets = assets.length

    for (const assetUrl of assets) {
      try {
        const response = await fetch(assetUrl)
        if (!response.ok) {
          throw new Error(`Failed to download ${assetUrl}`)
        }
        
        // Cache the asset
        const blob = await response.blob()
        const cache = await caches.open('game-assets')
        await cache.put(assetUrl, new Response(blob))
        
        downloadedCount++
        setDownloadProgress((downloadedCount / totalAssets) * 100)
        
      } catch (error) {
        console.warn(`Failed to download asset: ${assetUrl}`, error)
      }
    }
  }

  const importGameComponent = async (gameId: string, bundleUrl: string): Promise<React.ComponentType<any>> => {
    // Create a dynamic import based on game type and ID
    const gameModule = await import(/* webpackChunkName: "game-[request]" */ `@games/${gameId}/index.tsx`)
    
    if (!gameModule.default) {
      throw new Error('Game component not found')
    }

    // Wrap the game component with common game interface
    const WrappedGameComponent = lazy(() => Promise.resolve({
      default: (props: any) => {
        const GameComponent = gameModule.default
        return (
          <div className="game-container">
            <GameComponent
              {...props}
              onComplete={handleGameComplete}
              onExit={handleGameExit}
              isOffline={!syncStatus.isOnline}
            />
          </div>
        )
      }
    }))

    return WrappedGameComponent
  }

  const handleGameComplete = async (score: number, metadata?: any) => {
    const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000)
    
    try {
      // Save game score (offline-first)
      const gameScore = {
        gameId: gameId!,
        score,
        timeSpent,
        level: metadata?.level || 1,
        metadata: metadata || {},
        timestamp: new Date()
      }

      await saveOfflineGameScore(gameScore)
      
      // Call parent callback
      onGameComplete?.(score, timeSpent)
      
      toast.success(t('game.completed', { score }))
      
    } catch (error) {
      console.error('Failed to save game score:', error)
      toast.error(t('game.saveError'))
    }
  }

  const handleGameExit = () => {
    onGameExit?.()
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg">{t('game.loading')}</p>
        {downloadProgress > 0 && downloadProgress < 100 && (
          <div className="mt-4 w-64">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('game.downloading')}</span>
              <span>{Math.round(downloadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('game.error')}</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => loadGame(gameId!)}
              className="btn btn-primary"
            >
              {t('common.retry')}
            </button>
            <button
              onClick={handleGameExit}
              className="btn btn-outline"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!gameComponent || !game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h2 className="text-2xl font-bold mb-4">{t('game.crashed')}</h2>
          <p className="text-gray-300 mb-6">{t('game.crashedDescription')}</p>
          <button
            onClick={handleGameExit}
            className="btn btn-primary"
          >
            {t('common.back')}
          </button>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <div className="relative w-full h-screen bg-gray-900">
          {/* Game Controls Overlay */}
          <div className="absolute top-4 right-4 z-50 flex space-x-2">
            <button
              onClick={handleGameExit}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
              title={t('game.exit')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Game Component */}
          {React.createElement(gameComponent, {
            game,
            onComplete: handleGameComplete,
            onExit: handleGameExit
          })}

          {/* Offline Indicator */}
          {!syncStatus.isOnline && (
            <div className="absolute bottom-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-medium">
              {t('common.offline')}
            </div>
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

export default GameLoader
