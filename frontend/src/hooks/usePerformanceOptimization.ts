import { useState, useEffect, useCallback } from 'react'
import { 
  performanceMonitor, 
  adaptiveLoader, 
  memoryManager, 
  detectDeviceCapabilities,
  type DeviceCapabilities 
} from '@/utils/performance'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  networkLatency: number
  renderTime: number
}

interface PerformanceSettings {
  animationsEnabled: boolean
  imageQuality: 'low' | 'medium' | 'high'
  preloadEnabled: boolean
  maxConcurrentDownloads: number
  cacheSize: number
}

export const usePerformanceOptimization = () => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    networkLatency: 0,
    renderTime: 0
  })
  const [settings, setSettings] = useState<PerformanceSettings>({
    animationsEnabled: true,
    imageQuality: 'high',
    preloadEnabled: true,
    maxConcurrentDownloads: 4,
    cacheSize: 50 * 1024 * 1024 // 50MB
  })
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false)

  // Initialize performance monitoring
  useEffect(() => {
    const initializePerformance = async () => {
      // Detect device capabilities
      const deviceCapabilities = await detectDeviceCapabilities()
      setCapabilities(deviceCapabilities)

      // Adjust settings based on capabilities
      const optimizedSettings = getOptimizedSettings(deviceCapabilities)
      setSettings(optimizedSettings)

      // Start performance monitoring
      performanceMonitor.startMonitoring()

      // Subscribe to performance metrics
      const unsubscribe = performanceMonitor.subscribe((newMetrics) => {
        setMetrics(newMetrics)
        
        // Auto-adjust performance mode
        const shouldUseLowPerformanceMode = 
          newMetrics.fps < 20 || 
          newMetrics.memoryUsage > 0.8 ||
          deviceCapabilities.ram < 2
        
        setIsLowPerformanceMode(shouldUseLowPerformanceMode)
      })

      return unsubscribe
    }

    const cleanup = initializePerformance()

    return () => {
      cleanup.then(unsubscribe => unsubscribe?.())
      performanceMonitor.stopMonitoring()
    }
  }, [])

  // Listen for performance events
  useEffect(() => {
    const handleQualityReduction = () => {
      setSettings(prev => ({
        ...prev,
        animationsEnabled: false,
        imageQuality: 'low',
        preloadEnabled: false,
        maxConcurrentDownloads: 1
      }))
    }

    const handleQualityIncrease = () => {
      if (capabilities) {
        const optimizedSettings = getOptimizedSettings(capabilities)
        setSettings(optimizedSettings)
      }
    }

    const handleMemoryCleanup = () => {
      memoryManager.cleanup()
    }

    window.addEventListener('performance:reduce-quality', handleQualityReduction)
    window.addEventListener('performance:increase-quality', handleQualityIncrease)
    window.addEventListener('performance:memory-cleanup', handleMemoryCleanup)

    return () => {
      window.removeEventListener('performance:reduce-quality', handleQualityReduction)
      window.removeEventListener('performance:increase-quality', handleQualityIncrease)
      window.removeEventListener('performance:memory-cleanup', handleMemoryCleanup)
    }
  }, [capabilities])

  const getOptimizedSettings = (deviceCapabilities: DeviceCapabilities): PerformanceSettings => {
    const isLowEndDevice = deviceCapabilities.ram < 2 || 
                          deviceCapabilities.connection === '2g' ||
                          deviceCapabilities.gpu === 'low'

    const isMidRangeDevice = deviceCapabilities.ram < 4 || 
                            deviceCapabilities.connection === '3g' ||
                            deviceCapabilities.gpu === 'medium'

    if (isLowEndDevice) {
      return {
        animationsEnabled: false,
        imageQuality: 'low',
        preloadEnabled: false,
        maxConcurrentDownloads: 1,
        cacheSize: 10 * 1024 * 1024 // 10MB
      }
    }

    if (isMidRangeDevice) {
      return {
        animationsEnabled: true,
        imageQuality: 'medium',
        preloadEnabled: true,
        maxConcurrentDownloads: 2,
        cacheSize: 25 * 1024 * 1024 // 25MB
      }
    }

    return {
      animationsEnabled: true,
      imageQuality: 'high',
      preloadEnabled: true,
      maxConcurrentDownloads: 4,
      cacheSize: 50 * 1024 * 1024 // 50MB
    }
  }

  const loadModule = useCallback(async (
    importFn: () => Promise<any>, 
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    return adaptiveLoader.loadModule(importFn, priority)
  }, [])

  const optimizeImageSrc = useCallback((src: string) => {
    if (!capabilities) return src

    const quality = settings.imageQuality
    
    if (quality === 'low') {
      return src.replace(/\.(jpg|jpeg|png)$/i, '_low.$1')
    } else if (quality === 'medium') {
      return src.replace(/\.(jpg|jpeg|png)$/i, '_med.$1')
    }
    
    return src
  }, [capabilities, settings.imageQuality])

  const shouldReduceMotion = useCallback(() => {
    return !settings.animationsEnabled || 
           isLowPerformanceMode ||
           window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [settings.animationsEnabled, isLowPerformanceMode])

  const getGameSettings = useCallback(() => {
    if (!capabilities) return { fps: 30, quality: 'medium' }

    const isLowEnd = capabilities.ram < 2 || capabilities.gpu === 'low'
    const isMidRange = capabilities.ram < 4 || capabilities.gpu === 'medium'

    if (isLowEnd || isLowPerformanceMode) {
      return {
        fps: 20,
        quality: 'low',
        particlesEnabled: false,
        shadowsEnabled: false,
        antiAliasingEnabled: false
      }
    }

    if (isMidRange) {
      return {
        fps: 30,
        quality: 'medium',
        particlesEnabled: true,
        shadowsEnabled: false,
        antiAliasingEnabled: false
      }
    }

    return {
      fps: 60,
      quality: 'high',
      particlesEnabled: true,
      shadowsEnabled: true,
      antiAliasingEnabled: true
    }
  }, [capabilities, isLowPerformanceMode])

  const clearCache = useCallback(() => {
    memoryManager.clear()
  }, [])

  const getCacheInfo = useCallback(() => {
    return {
      size: memoryManager.getCacheSize(),
      maxSize: settings.cacheSize,
      usage: memoryManager.getCacheSize() / settings.cacheSize
    }
  }, [settings.cacheSize])

  return {
    // Device info
    capabilities,
    metrics,
    settings,
    isLowPerformanceMode,

    // Optimization methods
    loadModule,
    optimizeImageSrc,
    shouldReduceMotion,
    getGameSettings,
    
    // Cache management
    clearCache,
    getCacheInfo,

    // Performance indicators
    isSlowConnection: capabilities?.connection === '2g' || capabilities?.connection === '3g',
    isLowEndDevice: capabilities ? capabilities.ram < 2 : false,
    batteryLevel: capabilities?.batteryLevel || 1,
    isCharging: capabilities?.isCharging || true
  }
}

// Battery optimization hook
export const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = useState(1)
  const [isCharging, setIsCharging] = useState(true)

  useEffect(() => {
    const initBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery()
          
          setBatteryLevel(battery.level)
          setIsCharging(battery.charging)

          const handleLevelChange = () => setBatteryLevel(battery.level)
          const handleChargingChange = () => setIsCharging(battery.charging)

          battery.addEventListener('levelchange', handleLevelChange)
          battery.addEventListener('chargingchange', handleChargingChange)

          return () => {
            battery.removeEventListener('levelchange', handleLevelChange)
            battery.removeEventListener('chargingchange', handleChargingChange)
          }
        } catch (error) {
          console.warn('Battery API not available:', error)
        }
      }
    }

    const cleanup = initBattery()
    return () => cleanup?.then(fn => fn?.())
  }, [])

  const shouldReduceFeatures = batteryLevel < 0.2 && !isCharging
  const shouldReduceBackgroundActivity = batteryLevel < 0.1 && !isCharging

  return {
    batteryLevel,
    isCharging,
    shouldReduceFeatures,
    shouldReduceBackgroundActivity,
    
    // Adaptive settings based on battery
    animationsEnabled: !shouldReduceFeatures,
    syncInterval: shouldReduceFeatures ? 300000 : 60000, // 5min vs 1min
    backgroundSyncEnabled: !shouldReduceBackgroundActivity,
    pushNotificationsEnabled: !shouldReduceBackgroundActivity
  }
}

// Network-aware loading hook
export const useNetworkAware = () => {
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [effectiveType, setEffectiveType] = useState<string>('4g')

  useEffect(() => {
    const connection = (navigator as any).connection
    
    if (connection) {
      setConnectionType(connection.type || 'unknown')
      setEffectiveType(connection.effectiveType || '4g')

      const handleChange = () => {
        setConnectionType(connection.type || 'unknown')
        setEffectiveType(connection.effectiveType || '4g')
      }

      connection.addEventListener('change', handleChange)
      
      return () => connection.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const isSlowConnection = ['slow-2g', '2g', '3g'].includes(effectiveType)
  const isFastConnection = ['4g', 'wifi'].includes(effectiveType)

  return {
    connectionType,
    effectiveType,
    isOnline,
    isSlowConnection,
    isFastConnection,
    
    // Adaptive loading settings
    shouldPreload: isFastConnection && isOnline,
    maxImageQuality: isSlowConnection ? 'low' : isFastConnection ? 'high' : 'medium',
    chunkSize: isSlowConnection ? 'small' : 'large',
    concurrentRequests: isSlowConnection ? 1 : isFastConnection ? 4 : 2
  }
}
