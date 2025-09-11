# Performance Optimization for Low-Cost Devices & Low-Bandwidth

## 🎯 Target Specifications

### Low-Cost Android Devices
- **RAM**: 1-3GB
- **Storage**: 8-32GB
- **CPU**: Entry-level ARM processors
- **GPU**: Basic Adreno/Mali GPUs
- **Screen**: 720p-1080p displays
- **Android Version**: 7.0+ (API level 24+)

### Network Conditions
- **2G/3G Networks**: 50-500 Kbps
- **Intermittent Connectivity**: Frequent disconnections
- **Data Limits**: 500MB-2GB monthly caps
- **High Latency**: 300-1000ms response times

---

## 📦 Bundle Size Optimization

### Code Splitting Strategy
```typescript
// Dynamic imports for route-based splitting
const StudentDashboard = lazy(() => 
  import(/* webpackChunkName: "student-dashboard" */ '@pages/student/Dashboard')
)

// Feature-based splitting
const ChartComponents = lazy(() => 
  import(/* webpackChunkName: "charts" */ '@components/charts')
)

// Game-specific splitting
const loadGame = (gameId: string) => 
  import(/* webpackChunkName: "game-[request]" */ `@games/${gameId}`)
```

### Tree Shaking Configuration
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core essentials (< 100KB)
          vendor: ['react', 'react-dom'],
          
          // UI components (< 50KB)
          ui: ['@headlessui/react', '@heroicons/react'],
          
          // Charts (lazy loaded)
          charts: ['chart.js', 'react-chartjs-2'],
          
          // Games (lazy loaded per game)
          // Each game should be < 200KB
        }
      }
    },
    
    // Target older devices
    target: 'es2015',
    
    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  }
})
```

### Bundle Size Targets
- **Initial Load**: < 150KB (gzipped)
- **Route Chunks**: < 50KB each
- **Game Bundles**: < 200KB each
- **Total App**: < 2MB (including all features)

---

## 🖼️ Image & Asset Optimization

### Image Formats & Sizes
```typescript
// Image optimization pipeline
const imageFormats = {
  // Use WebP with JPEG fallback
  hero: {
    webp: 'hero.webp',
    fallback: 'hero.jpg',
    sizes: '(max-width: 768px) 100vw, 50vw'
  },
  
  // Optimize for different screen densities
  icon: {
    '1x': 'icon-24.png',
    '2x': 'icon-48.png',
    '3x': 'icon-72.png'
  }
}

// Lazy loading with intersection observer
const LazyImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      {...props}
    />
  )
}
```

### Asset Compression
```bash
# Image optimization pipeline
imagemin src/assets/images/* --out-dir=dist/assets/images \
  --plugin=imagemin-webp \
  --plugin=imagemin-mozjpeg \
  --plugin=imagemin-pngquant

# Audio compression for game sounds
ffmpeg -i input.wav -c:a libvorbis -q:a 4 output.ogg
```

---

## 🚀 Runtime Performance

### Memory Management
```typescript
// Efficient component rendering
const MemoizedComponent = React.memo(({ data }) => {
  return <ExpensiveComponent data={data} />
}, (prevProps, nextProps) => {
  // Custom comparison for shallow equality
  return prevProps.data.id === nextProps.data.id
})

// Cleanup intervals and listeners
useEffect(() => {
  const interval = setInterval(() => {
    // Cleanup unused cached data
    cleanupCache()
  }, 30000)

  return () => clearInterval(interval)
}, [])

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window'

const VirtualizedList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        {data[index].name}
      </div>
    )}
  </List>
)
```

### CPU Optimization
```typescript
// Web Workers for heavy computations
const gameWorker = new Worker('/workers/game-logic.js')

gameWorker.postMessage({
  type: 'CALCULATE_SCORE',
  data: gameData
})

gameWorker.onmessage = (event) => {
  const { result } = event.data
  updateGameScore(result)
}

// RequestIdleCallback for non-critical tasks
const scheduleWork = (task: () => void) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(task, { timeout: 1000 })
  } else {
    setTimeout(task, 0)
  }
}

// Debounced search to reduce API calls
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    searchContent(query)
  }, 300),
  []
)
```

---

## 🌐 Network Optimization

### Request Optimization
```typescript
// Request batching
class RequestBatcher {
  private batch: Array<{ url: string; resolve: Function; reject: Function }> = []
  private timeout: NodeJS.Timeout | null = null

  add(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.batch.push({ url, resolve, reject })
      
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), 100)
      }
    })
  }

  private async flush() {
    const currentBatch = [...this.batch]
    this.batch = []
    this.timeout = null

    try {
      const response = await fetch('/api/batch', {
        method: 'POST',
        body: JSON.stringify({
          requests: currentBatch.map(item => ({ url: item.url }))
        })
      })
      
      const results = await response.json()
      
      currentBatch.forEach((item, index) => {
        item.resolve(results[index])
      })
    } catch (error) {
      currentBatch.forEach(item => item.reject(error))
    }
  }
}

// Connection-aware loading
const useNetworkAware = () => {
  const [connectionType, setConnectionType] = useState('unknown')
  
  useEffect(() => {
    const connection = (navigator as any).connection
    if (connection) {
      setConnectionType(connection.effectiveType)
      
      const handleChange = () => {
        setConnectionType(connection.effectiveType)
      }
      
      connection.addEventListener('change', handleChange)
      return () => connection.removeEventListener('change', handleChange)
    }
  }, [])
  
  return {
    isSlowConnection: ['slow-2g', '2g'].includes(connectionType),
    connectionType
  }
}
```

### Caching Strategy
```typescript
// Multi-level caching
class CacheManager {
  private memoryCache = new Map()
  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024 // 50MB

  async get(key: string): Promise<any> {
    // 1. Check memory cache
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)
    }

    // 2. Check IndexedDB
    const dbResult = await this.getFromDB(key)
    if (dbResult) {
      this.memoryCache.set(key, dbResult)
      return dbResult
    }

    // 3. Check HTTP cache
    const response = await fetch(`/api/cache/${key}`)
    if (response.ok) {
      const data = await response.json()
      await this.setInDB(key, data)
      this.memoryCache.set(key, data)
      return data
    }

    return null
  }

  private async cleanupMemory() {
    if (this.getMemorySize() > this.MAX_MEMORY_SIZE) {
      // Remove least recently used items
      const entries = Array.from(this.memoryCache.entries())
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      
      for (let i = 0; i < entries.length / 2; i++) {
        this.memoryCache.delete(entries[i][0])
      }
    }
  }
}
```

---

## 📱 Device-Specific Optimizations

### Touch & Gesture Optimization
```typescript
// Optimized touch handling
const useTouchOptimized = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart) return
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    
    // Implement swipe gestures with minimum distance
    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
      // Handle swipe
    }
    
    setTouchStart(null)
  }, [touchStart])
  
  return { handleTouchStart, handleTouchEnd }
}

// Reduce touch delay
const fastClick = (callback: () => void) => {
  let touchStartTime = 0
  
  return {
    onTouchStart: () => {
      touchStartTime = Date.now()
    },
    onTouchEnd: (e: TouchEvent) => {
      if (Date.now() - touchStartTime < 150) {
        e.preventDefault()
        callback()
      }
    }
  }
}
```

### Battery Optimization
```typescript
// Battery-aware features
const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = useState(1)
  const [isCharging, setIsCharging] = useState(true)
  
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level)
        setIsCharging(battery.charging)
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level)
        })
        
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging)
        })
      })
    }
  }, [])
  
  // Reduce features when battery is low
  const shouldReduceFeatures = batteryLevel < 0.2 && !isCharging
  
  return {
    batteryLevel,
    isCharging,
    shouldReduceFeatures,
    // Disable animations when battery is low
    animationsEnabled: !shouldReduceFeatures,
    // Reduce sync frequency
    syncInterval: shouldReduceFeatures ? 300000 : 60000 // 5min vs 1min
  }
}
```

---

## 🎮 Game Performance

### Game Engine Optimization
```typescript
// Lightweight game loop
class OptimizedGameEngine {
  private lastFrameTime = 0
  private targetFPS = 30 // Lower FPS for low-end devices
  private frameInterval = 1000 / this.targetFPS
  
  private gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastFrameTime
    
    if (deltaTime >= this.frameInterval) {
      this.update(deltaTime)
      this.render()
      this.lastFrameTime = currentTime - (deltaTime % this.frameInterval)
    }
    
    requestAnimationFrame(this.gameLoop)
  }
  
  private update(deltaTime: number) {
    // Update game logic with delta time
    // Use object pooling to reduce GC pressure
  }
  
  private render() {
    // Batch rendering operations
    // Use CSS transforms instead of changing layout properties
  }
}

// Object pooling for game entities
class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void
  
  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn
    this.resetFn = resetFn
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn())
    }
  }
  
  get(): T {
    return this.pool.pop() || this.createFn()
  }
  
  release(obj: T) {
    this.resetFn(obj)
    this.pool.push(obj)
  }
}
```

---

## 📊 Performance Monitoring

### Real-time Performance Metrics
```typescript
// Performance monitoring
class PerformanceMonitor {
  private metrics = {
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    networkLatency: 0
  }
  
  startMonitoring() {
    // FPS monitoring
    this.monitorFPS()
    
    // Memory monitoring
    this.monitorMemory()
    
    // Network monitoring
    this.monitorNetwork()
  }
  
  private monitorFPS() {
    let frames = 0
    let lastTime = performance.now()
    
    const countFPS = () => {
      frames++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime))
        frames = 0
        lastTime = currentTime
        
        // Adjust quality based on FPS
        if (this.metrics.fps < 20) {
          this.reduceQuality()
        }
      }
      
      requestAnimationFrame(countFPS)
    }
    
    requestAnimationFrame(countFPS)
  }
  
  private monitorMemory() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        
        // Trigger cleanup if memory usage is high
        if (this.metrics.memoryUsage > 0.8) {
          this.triggerCleanup()
        }
      }, 5000)
    }
  }
  
  private reduceQuality() {
    // Disable animations
    document.body.classList.add('reduce-motion')
    
    // Lower image quality
    document.body.classList.add('low-quality')
    
    // Reduce particle effects in games
    this.emit('reduce-quality')
  }
}
```

### Adaptive Loading
```typescript
// Adaptive content loading based on device capabilities
const useAdaptiveLoading = () => {
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    ram: 4, // GB
    cores: 4,
    gpu: 'high',
    connection: '4g'
  })
  
  useEffect(() => {
    // Detect device capabilities
    const detectCapabilities = async () => {
      const capabilities = {
        ram: (navigator as any).deviceMemory || 4,
        cores: navigator.hardwareConcurrency || 4,
        gpu: await detectGPU(),
        connection: (navigator as any).connection?.effectiveType || '4g'
      }
      
      setDeviceCapabilities(capabilities)
    }
    
    detectCapabilities()
  }, [])
  
  const getContentQuality = () => {
    if (deviceCapabilities.ram < 2 || deviceCapabilities.connection === '2g') {
      return 'low'
    }
    if (deviceCapabilities.ram < 4 || deviceCapabilities.connection === '3g') {
      return 'medium'
    }
    return 'high'
  }
  
  return {
    deviceCapabilities,
    contentQuality: getContentQuality(),
    shouldPreload: deviceCapabilities.ram > 2,
    maxConcurrentDownloads: deviceCapabilities.cores > 2 ? 4 : 2
  }
}
```

---

## 🔧 Build & Deployment Optimizations

### Webpack/Vite Configuration
```typescript
// Production optimizations
export default defineConfig({
  build: {
    // Enable compression
    rollupOptions: {
      output: {
        // Optimize chunk sizes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('chart')) return 'charts'
            return 'vendor'
          }
        }
      }
    },
    
    // Optimize for size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    
    // Enable source maps only for errors
    sourcemap: 'hidden'
  },
  
  // PWA optimizations
  plugins: [
    VitePWA({
      workbox: {
        // Aggressive caching for static assets
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
})
```

### CDN & Compression
```nginx
# Nginx configuration for optimal delivery
server {
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Enable brotli compression (if available)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Cache HTML with shorter expiry
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
    }
}
```

This comprehensive optimization strategy ensures the rural education platform performs well on low-cost Android devices with limited bandwidth, providing an excellent learning experience even in challenging technical environments.
