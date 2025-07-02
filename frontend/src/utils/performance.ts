/**
 * Performance monitoring utilities for the collision simulator.
 */

export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();
  private static timers: Map<string, number> = new Map();

  /**
   * Start timing a performance measurement
   */
  static startMeasurement(name: string): void {
    this.timers.set(name, performance.now());
  }

  /**
   * End timing and record the measurement
   */
  static endMeasurement(name: string): number | null {
    const startTime = this.timers.get(name);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    
    const measurements = this.measurements.get(name)!;
    measurements.push(duration);
    
    // Keep only the last 100 measurements to prevent memory leaks
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    this.timers.delete(name);
    return duration;
  }

  /**
   * Get performance statistics for a measurement
   */
  static getStats(name: string): {
    average: number;
    min: number;
    max: number;
    count: number;
    latest: number;
  } | null {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return null;

    const average = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const latest = measurements[measurements.length - 1];

    return { average, min, max, count: measurements.length, latest };
  }

  /**
   * Get all performance data
   */
  static getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [name] of this.measurements) {
      stats[name] = this.getStats(name);
    }
    
    return stats;
  }

  /**
   * Clear all measurements
   */
  static clear(): void {
    this.measurements.clear();
    this.timers.clear();
  }

  /**
   * Log performance summary to console
   */
  static logSummary(): void {
    const stats = this.getAllStats();
    console.group('🚀 Performance Summary');
    
    Object.entries(stats).forEach(([name, data]) => {
      if (data) {
        console.log(`${name}:`, {
          average: `${data.average.toFixed(2)}ms`,
          latest: `${data.latest.toFixed(2)}ms`,
          min: `${data.min.toFixed(2)}ms`,
          max: `${data.max.toFixed(2)}ms`,
          samples: data.count
        });
      }
    });
    
    console.groupEnd();
  }
}

/**
 * Decorator for automatic performance measurement
 */
export function measurePerformance(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const measurementName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      PerformanceMonitor.startMeasurement(measurementName);
      const result = originalMethod.apply(this, args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          PerformanceMonitor.endMeasurement(measurementName);
        });
      } else {
        PerformanceMonitor.endMeasurement(measurementName);
        return result;
      }
    };

    return descriptor;
  };
}

/**
 * Throttle function that limits execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function that delays execution until after calls have stopped
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  /**
   * Get current memory usage (if available)
   */
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } | null {
    // @ts-ignore - performance.memory is experimental
    const memory = (performance as any).memory;
    
    if (!memory) return null;
    
    const used = memory.usedJSHeapSize;
    const total = memory.totalJSHeapSize;
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  }

  /**
   * Log memory usage to console
   */
  static logMemoryUsage(): void {
    const usage = this.getMemoryUsage();
    
    if (usage) {
      console.log('💾 Memory Usage:', {
        used: `${(usage.used / (1024 * 1024)).toFixed(2)} MB`,
        total: `${(usage.total / (1024 * 1024)).toFixed(2)} MB`,
        percentage: `${usage.percentage.toFixed(1)}%`
      });
    } else {
      console.log('💾 Memory monitoring not available in this environment');
    }
  }
}

// Development helper for performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Log performance summary every 30 seconds
  setInterval(() => {
    if (Object.keys(PerformanceMonitor.getAllStats()).length > 0) {
      PerformanceMonitor.logSummary();
      MemoryMonitor.logMemoryUsage();
    }
  }, 30000);
} 