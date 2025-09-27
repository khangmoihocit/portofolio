import { useState, useEffect, useRef } from 'react';
import { loadBalancer } from '../services/apiLoadBalancer';

/**
 * Hook để monitor performance real-time của Load Balancer
 * Cung cấp metrics và statistics cho monitoring dashboard
 */
export function useLoadBalancerMonitor() {
    const [metrics, setMetrics] = useState({
        requestsPerMinute: 0,
        averageResponseTime: 0,
        successRate: 100,
        queueSize: 0,
        activeRequests: 0,
        healthyKeys: 0,
        totalKeys: 0,
        topPerformingKey: null,
        systemLoad: 'LOW'
    });

    const [history, setHistory] = useState([]);
    const intervalRef = useRef(null);
    const requestCountRef = useRef(0);
    const lastRequestCountRef = useRef(0);

    // Track requests per minute
    const trackRequestsPerMinute = () => {
        const currentCount = requestCountRef.current;
        const requestsThisMinute = currentCount - lastRequestCountRef.current;
        lastRequestCountRef.current = currentCount;
        return requestsThisMinute;
    };

    // Update metrics periodically
    useEffect(() => {
        const updateMetrics = () => {
            try {
                const status = loadBalancer.getStatus();
                const rpm = trackRequestsPerMinute();
                
                // Calculate system load based on various factors
                const queueLoad = status.queue.size / status.queue.maxSize;
                const activeLoad = status.activeRequests / (loadBalancer.maxConcurrentPerKey * status.keys.length);
                const failureRate = (status.metrics.failedRequests || 0) / (status.metrics.totalRequests || 1);
                
                let systemLoad = 'LOW';
                if (queueLoad > 0.7 || activeLoad > 0.8 || failureRate > 0.2) {
                    systemLoad = 'HIGH';
                } else if (queueLoad > 0.4 || activeLoad > 0.5 || failureRate > 0.1) {
                    systemLoad = 'MEDIUM';
                }

                // Find top performing key
                const topKey = status.keys.reduce((best, current) => {
                    if (!current.isHealthy) return best;
                    
                    const currentScore = parseFloat(current.successRate) - current.activeRequests;
                    const bestScore = best ? (parseFloat(best.successRate) - best.activeRequests) : -1;
                    
                    return currentScore > bestScore ? current : best;
                }, null);

                const newMetrics = {
                    requestsPerMinute: rpm,
                    averageResponseTime: status.metrics.averageResponseTime || 0,
                    successRate: parseFloat(status.metrics.successRate) || 100,
                    queueSize: status.queue.size,
                    activeRequests: status.activeRequests,
                    healthyKeys: status.keys.filter(k => k.isHealthy).length,
                    totalKeys: status.keys.length,
                    topPerformingKey: topKey,
                    systemLoad,
                    keyStates: status.keys
                };

                setMetrics(newMetrics);

                // Add to history for trending (keep last 60 data points = 2 minutes)
                setHistory(prev => {
                    const newHistory = [...prev, {
                        timestamp: Date.now(),
                        ...newMetrics
                    }].slice(-60);
                    return newHistory;
                });

                // Update request count
                requestCountRef.current = status.metrics.totalRequests || 0;

            } catch (error) {
                console.error('Error updating metrics:', error);
            }
        };

        // Initial update
        updateMetrics();

        // Update every 2 seconds
        intervalRef.current = setInterval(updateMetrics, 2000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    /**
     * Get performance trend
     * @param {string} metric - Metric name to get trend for
     * @returns {string} 'UP', 'DOWN', or 'STABLE'
     */
    const getTrend = (metric) => {
        if (history.length < 5) return 'STABLE';
        
        const recent = history.slice(-5);
        const first = recent[0][metric];
        const last = recent[recent.length - 1][metric];
        
        if (last > first * 1.1) return 'UP';
        if (last < first * 0.9) return 'DOWN';
        return 'STABLE';
    };

    /**
     * Get health score (0-100)
     */
    const getHealthScore = () => {
        if (metrics.totalKeys === 0) return 0;
        
        const keyHealthScore = (metrics.healthyKeys / metrics.totalKeys) * 50;
        const performanceScore = Math.min(metrics.successRate / 2, 40);
        const loadScore = metrics.systemLoad === 'LOW' ? 10 : 
                         metrics.systemLoad === 'MEDIUM' ? 5 : 0;
        
        return Math.round(keyHealthScore + performanceScore + loadScore);
    };

    /**
     * Get recommended actions based on current state
     */
    const getRecommendations = () => {
        const recommendations = [];
        
        if (metrics.systemLoad === 'HIGH') {
            recommendations.push({
                type: 'WARNING',
                message: 'System load is high. Consider adding more API keys.',
                action: 'scale_up'
            });
        }
        
        if (metrics.successRate < 95) {
            recommendations.push({
                type: 'ERROR',
                message: 'Success rate is below 95%. Check API key health.',
                action: 'check_keys'
            });
        }
        
        if (metrics.queueSize > 10) {
            recommendations.push({
                type: 'WARNING',
                message: 'Queue size is growing. Users may experience delays.',
                action: 'optimize_performance'
            });
        }
        
        if (metrics.healthyKeys < metrics.totalKeys * 0.5) {
            recommendations.push({
                type: 'CRITICAL',
                message: 'Less than 50% of API keys are healthy.',
                action: 'reset_failed_keys'
            });
        }

        return recommendations;
    };

    return {
        metrics,
        history,
        healthScore: getHealthScore(),
        trends: {
            requestsPerMinute: getTrend('requestsPerMinute'),
            responseTime: getTrend('averageResponseTime'),
            successRate: getTrend('successRate')
        },
        recommendations: getRecommendations(),
        isHealthy: getHealthScore() > 70
    };
}

/**
 * Hook để track individual request performance
 */
export function useRequestTracker() {
    const [activeRequests, setActiveRequests] = useState(new Map());

    const startTracking = (requestId) => {
        setActiveRequests(prev => new Map(prev).set(requestId, {
            startTime: Date.now(),
            status: 'PENDING'
        }));
    };

    const completeTracking = (requestId, success = true, error = null) => {
        setActiveRequests(prev => {
            const newMap = new Map(prev);
            const request = newMap.get(requestId);
            
            if (request) {
                request.endTime = Date.now();
                request.duration = request.endTime - request.startTime;
                request.status = success ? 'SUCCESS' : 'FAILED';
                request.error = error;
                
                // Remove after 5 seconds for cleanup
                setTimeout(() => {
                    setActiveRequests(current => {
                        const updated = new Map(current);
                        updated.delete(requestId);
                        return updated;
                    });
                }, 5000);
            }
            
            return newMap;
        });
    };

    return {
        activeRequests: Array.from(activeRequests.values()),
        startTracking,
        completeTracking
    };
}

/**
 * Hook để auto-optimization của load balancer
 */
export function useAutoOptimization() {
    const { metrics, recommendations } = useLoadBalancerMonitor();
    const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false);
    const [optimizationActions, setOptimizationActions] = useState([]);

    useEffect(() => {
        if (!autoOptimizeEnabled) return;

        recommendations.forEach(rec => {
            switch (rec.action) {
                case 'reset_failed_keys':
                    if (metrics.healthyKeys < metrics.totalKeys * 0.3) {
                        loadBalancer.resetFailedKeys();
                        setOptimizationActions(prev => [...prev, {
                            timestamp: Date.now(),
                            action: 'Reset failed keys',
                            reason: rec.message
                        }]);
                    }
                    break;
                    
                case 'optimize_performance':
                    // Could implement automatic queue prioritization
                    break;
                    
                default:
                    break;
            }
        });
    }, [recommendations, autoOptimizeEnabled, metrics]);

    return {
        autoOptimizeEnabled,
        setAutoOptimizeEnabled,
        optimizationActions,
        clearActions: () => setOptimizationActions([])
    };
}