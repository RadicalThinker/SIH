/**
 * Performance utilities for low-cost devices and low-bandwidth optimization
 */

// Device capability detection
export interface DeviceCapabilities {
  ram: number // GB
  cores: number
  gpu: 'low' | 'medium' | 'high'
  connection: '2g' | '3g' | '4g' | 'wifi' | 'unknown'
  batteryLevel: number
  isCharging: boolean
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics = {
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    networkLatency: 0,
    renderTime: 0
  }

  private observers: Array<(metrics: typeof this.metrics) => void> = []
  private isMonitoring = false

  startMonitoring() {
    if (this.isMonitoring) return
    this.isMonitoring = true

    this.monitorFPS()
    this.monitorMemory()
    this.monitorNetwork()
  }

  stopMonitoring() {
    this.isMonitoring = false
  }

  subscribe(callback: (metrics: typeof this.metrics) => void) {
    this.observers.push(callback)
    return () => {
      const index = this.observers.indexOf(callback)
      if (index > -1) this.observers.splice(index, 1)
    }
  }

  private notifyObservers() {
    this.observers.forEach(callback => callback({ ...this.metrics }))
  }

  private monitorFPS() {
    let frames = 0
    let lastTime = performance.now()

    const countFPS = () => {
      if (!this.isMonitoring) return

      frames++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime))
        frames = 0
        lastTime = currentTime
        this.notifyObservers()

        // Auto-adjust quality based on FPS
        if (this.metrics.fps < 20) {
          this.triggerQualityReduction()
        } else if (this.metrics.fps > 50) {
          this.triggerQualityIncrease()
        }
      }

      requestAnimationFrame(countFPS)
    }

    requestAnimationFrame(countFPS)
  }

  private monitorMemory() {
    if (!('memory' in performance)) return

    const checkMemory = () => {
      if (!this.isMonitoring) return

      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit

      // Trigger cleanup if memory usage is high
      if (this.metrics.memoryUsage > 0.8) {
        this.triggerMemoryCleanup()
      }

      setTimeout(checkMemory, 5000)
    }

    checkMemory()
  }

  private monitorNetwork() {
    const measureLatency = async () => {
      if (!this.isMonitoring) return

      const start = performance.now()
      try {
        await fetch('/api/ping', { method: 'HEAD' })
        this.metrics.networkLatency = performance.now() - start
      } catch (error) {
        this.metrics.networkLatency = -1 // Network error
      }

      setTimeout(measureLatency, 10000)
    }

    measureLatency()
  }

  private triggerQualityReduction() {
    document.body.classList.add('low-performance-mode')
    window.dispatchEvent(new CustomEvent('performance:reduce-quality'))
  }

  private triggerQualityIncrease() {
    document.body.classList.remove('low-performance-mode')
    window.dispatchEvent(new CustomEvent('performance:increase-quality'))
  }

  private triggerMemoryCleanup() {
    window.dispatchEvent(new CustomEvent('performance:memory-cleanup'))
  }
}

// Device capability detection
export const detectDeviceCapabilities = async (): Promise<DeviceCapabilities> => {
  const capabilities: DeviceCapabilities = {
    ram: (navigator as any).deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    gpu: await detectGPUCapability(),
    connection: getConnectionType(),
    batteryLevel: await getBatteryLevel(),
    isCharging: await getChargingStatus()
  }

  return capabilities
}

const detectGPUCapability = async (): Promise<'low' | 'medium' | 'high'> => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) return 'low'

    // Ensure we have a WebGL context
    if (!(gl instanceof WebGLRenderingContext) && !(gl instanceof WebGL2RenderingContext)) {
      return 'medium'
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (!debugInfo) return 'medium'

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    
    // Basic GPU classification
    if (renderer.includes('Adreno 3') || renderer.includes('Mali-4')) return 'low'
    if (renderer.includes('Adreno 5') || renderer.includes('Mali-G')) return 'medium'
    
    return 'high'
  } catch (error) {
    return 'low'
  }
}

const getConnectionType = (): DeviceCapabilities['connection'] => {
  const connection = (navigator as any).connection
  if (!connection) return 'unknown'
  
  return connection.effectiveType || 'unknown'
}

const getBatteryLevel = async (): Promise<number> => {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery()
      return battery.level
    }
  } catch (error) {
    // Battery API not supported
  }
  return 1 // Assume full battery if not available
}

const getChargingStatus = async (): Promise<boolean> => {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery()
      return battery.charging
    }
  } catch (error) {
    // Battery API not supported
  }
  return true // Assume charging if not available
}

// Image optimization utilities
export const optimizeImageForDevice = (
  src: string, 
  capabilities: DeviceCapabilities
): string => {
  const quality = getImageQuality(capabilities)
  
  // Return appropriate image URL based on quality
  if (quality === 'low') {
    return src.replace(/\.(jpg|jpeg|png)$/i, '_low.$1')
  } else if (quality === 'medium') {
    return src.replace(/\.(jpg|jpeg|png)$/i, '_med.$1')
  }
  
  return src
}

const getImageQuality = (capabilities: DeviceCapabilities): 'low' | 'medium' | 'high' => {
  if (capabilities.ram < 2 || capabilities.connection === '2g') return 'low'
  if (capabilities.ram < 4 || capabilities.connection === '3g') return 'medium'
  return 'high'
}

// Bundle loading optimization
export class AdaptiveLoader {
  private capabilities: DeviceCapabilities | null = null
  private loadQueue: Array<() => Promise<any>> = []
  private isLoading = false

  async initialize() {
    this.capabilities = await detectDeviceCapabilities()
  }

  async loadModule(importFn: () => Promise<any>, priority: 'high' | 'medium' | 'low' = 'medium') {
    if (!this.capabilities) {
      await this.initialize()
    }

    const shouldPreload = this.shouldPreload(priority)
    
    if (shouldPreload) {
      return this.executeLoad(importFn)
    } else {
      return this.queueLoad(importFn)
    }
  }

  private shouldPreload(priority: 'high' | 'medium' | 'low'): boolean {
    if (!this.capabilities) return false

    // Always preload high priority
    if (priority === 'high') return true

    // Preload medium priority on good devices
    if (priority === 'medium' && this.capabilities.ram > 2) return true

    // Only preload low priority on high-end devices
    if (priority === 'low' && this.capabilities.ram > 4) return true

    return false
  }

  private async executeLoad(importFn: () => Promise<any>) {
    try {
      return await importFn()
    } catch (error) {
      console.error('Module loading failed:', error)
      throw error
    }
  }

  private queueLoad(importFn: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadQueue.push(async () => {
        try {
          const result = await importFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isLoading || this.loadQueue.length === 0) return

    this.isLoading = true

    // Process queue with limited concurrency based on device capabilities
    const maxConcurrent = this.capabilities?.cores || 2
    const batch = this.loadQueue.splice(0, Math.min(maxConcurrent, this.loadQueue.length))

    try {
      await Promise.all(batch.map(loader => loader()))
    } catch (error) {
      console.error('Batch loading failed:', error)
    }

    this.isLoading = false

    // Process next batch if queue is not empty
    if (this.loadQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100)
    }
  }
}

// Memory management utilities
export const createMemoryManager = () => {
  const cache = new Map<string, { data: any; timestamp: number; size: number }>()
  const MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB

  const set = (key: string, data: any) => {
    const size = JSON.stringify(data).length
    cache.set(key, { data, timestamp: Date.now(), size })
    
    // Cleanup if cache is too large
    if (getCacheSize() > MAX_CACHE_SIZE) {
      cleanup()
    }
  }

  const get = (key: string) => {
    const item = cache.get(key)
    if (item) {
      item.timestamp = Date.now() // Update access time
      return item.data
    }
    return null
  }

  const getCacheSize = () => {
    let totalSize = 0
    cache.forEach(item => {
      totalSize += item.size
    })
    return totalSize
  }

  const cleanup = () => {
    // Remove least recently used items
    const entries = Array.from(cache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    // Remove oldest 50% of items
    const toRemove = entries.slice(0, Math.floor(entries.length / 2))
    toRemove.forEach(([key]) => cache.delete(key))
  }

  const clear = () => {
    cache.clear()
  }

  return { set, get, getCacheSize, cleanup, clear }
}

// Network optimization utilities
export class NetworkOptimizer {
  private requestQueue: Array<{
    url: string
    options: RequestInit
    resolve: (value: Response) => void
    reject: (reason: any) => void
  }> = []
  
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly BATCH_DELAY = 100 // ms

  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // For GET requests, try batching
    if (!options.method || options.method === 'GET') {
      return this.batchedFetch(url, options)
    }

    // For other methods, fetch immediately
    return fetch(url, options)
  }

  private batchedFetch(url: string, options: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject })

      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.processBatch()
        }, this.BATCH_DELAY)
      }
    })
  }

  private async processBatch() {
    const batch = [...this.requestQueue]
    this.requestQueue = []
    this.batchTimeout = null

    if (batch.length === 1) {
      // Single request, no need to batch
      const { url, options, resolve, reject } = batch[0]
      try {
        const response = await fetch(url, options)
        resolve(response)
      } catch (error) {
        reject(error)
      }
      return
    }

    // Multiple requests, send as batch
    try {
      const batchResponse = await fetch('/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: batch.map(({ url, options }) => ({ url, options }))
        })
      })

      const results = await batchResponse.json()
      
      batch.forEach((request, index) => {
        const result = results[index]
        if (result.error) {
          request.reject(new Error(result.error))
        } else {
          // Create a mock Response object
          const response = new Response(JSON.stringify(result.data), {
            status: result.status || 200,
            headers: result.headers || {}
          })
          request.resolve(response)
        }
      })
    } catch (error) {
      // If batch fails, reject all requests
      batch.forEach(request => request.reject(error))
    }
  }
}

// Create singleton instances
export const performanceMonitor = new PerformanceMonitor()
export const adaptiveLoader = new AdaptiveLoader()
export const memoryManager = createMemoryManager()
export const networkOptimizer = new NetworkOptimizer()

// Auto-initialize on module load
adaptiveLoader.initialize()
