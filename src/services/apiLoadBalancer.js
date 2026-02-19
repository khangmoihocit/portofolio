import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSystemPrompt } from './promptService';

class ApiLoadBalancer {
    constructor() {
        // API Keys configuration
        this.apiKeys = [
            import.meta.env.VITE_GEMINI_API_KEY || '',
            import.meta.env.VITE_GEMINI_API_KEY_1 || '',
            import.meta.env.VITE_GEMINI_API_KEY_2 || '',
            import.meta.env.VITE_GEMINI_API_KEY_3 || '',
            import.meta.env.VITE_GEMINI_API_KEY_4 || '',
            import.meta.env.VITE_GEMINI_API_KEY_5 || '',
            import.meta.env.VITE_GEMINI_API_KEY_6 || '',
            import.meta.env.VITE_GEMINI_API_KEY_7 || '',
            import.meta.env.VITE_GEMINI_API_KEY_8 || '',
        ].filter(key => key !== '');

        this.keyStates = this.apiKeys.map(() => ({
            state: 'CLOSED',
            failureCount: 0,
            lastFailure: null,
            nextAttempt: null,
            requestCount: 0,
            successCount: 0,
            avgResponseTime: 0,
            isHealthy: true
        }));

        this.requestQueue = [];
        this.activeRequests = new Map();
        this.maxConcurrentPerKey = 3;
        this.maxQueueSize = 50;

        this.failureThreshold = 3;
        this.recoveryTimeout = 60000;
        this.healthCheckInterval = 30000;

        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            keyUsageStats: new Map()
        };

        this.startHealthCheck();
        setInterval(() => this.cleanupMetrics(), 300000);
    }

    selectOptimalKey() {
        const healthyKeys = this.keyStates
            .map((state, index) => ({ ...state, index }))
            .filter(key => 
                key.state === 'CLOSED' && 
                key.isHealthy &&
                this.getActiveRequestsForKey(key.index) < this.maxConcurrentPerKey
            );

        if (healthyKeys.length === 0) {
            const halfOpenKeys = this.keyStates
                .map((state, index) => ({ ...state, index }))
                .filter(key => key.state === 'HALF_OPEN');
            if (halfOpenKeys.length > 0) return halfOpenKeys[0].index;

            const availableKeys = this.keyStates
                .map((state, index) => ({ index, activeRequests: this.getActiveRequestsForKey(index) }))
                .filter(key => key.activeRequests < this.maxConcurrentPerKey)
                .sort((a, b) => a.activeRequests - b.activeRequests);
            return availableKeys.length > 0 ? availableKeys[0].index : -1;
        }

        const keyScores = healthyKeys.map(key => ({ ...key, score: this.calculateKeyScore(key) }));
        keyScores.sort((a, b) => b.score - a.score);
        return keyScores[0].index;
    }

    calculateKeyScore(keyState) {
        const successRate = keyState.requestCount > 0 ? (keyState.successCount / keyState.requestCount) : 1;
        const responseTimeScore = keyState.avgResponseTime > 0 ? (1000 / keyState.avgResponseTime) : 1;
        const loadScore = 1 / (this.getActiveRequestsForKey(keyState.index) + 1);
        return (successRate * 0.5) + (responseTimeScore * 0.3) + (loadScore * 0.2);
    }

    getActiveRequestsForKey(keyIndex) {
        return Array.from(this.activeRequests.values()).filter(req => req.keyIndex === keyIndex).length;
    }

    async processRequest(userMessage, conversationHistory = [], requestId = null) {
        if (!requestId) requestId = this.generateRequestId();

        if (this.requestQueue.length >= this.maxQueueSize) {
            throw new Error('Hệ thống đang quá tải. Vui lòng thử lại sau ít phút.');
        }

        return new Promise((resolve, reject) => {
            const request = {
                id: requestId, userMessage, conversationHistory, resolve, reject,
                timestamp: Date.now(), attempts: 0, maxAttempts: 3
            };
            this.requestQueue.push(request);
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.requestQueue.length === 0) return;

        const keyIndex = this.selectOptimalKey();
        if (keyIndex === -1) {
            setTimeout(() => this.processQueue(), 1000);
            return;
        }
        
        const request = this.requestQueue.shift();
        if (!request) return;

        const keyState = this.keyStates[keyIndex];
        if (keyState.state === 'OPEN') {
            if (Date.now() < keyState.nextAttempt) {
                this.requestQueue.unshift(request);
                return;
            } else {
                keyState.state = 'HALF_OPEN';
            }
        }
        this.executeRequest(request, keyIndex);
    }

    async executeRequest(request, keyIndex) {
        const startTime = Date.now();
        request.keyIndex = keyIndex;
        this.activeRequests.set(request.id, request);

        try {
            const response = await this.callGeminiApi(request.userMessage, request.conversationHistory, keyIndex);
            const responseTime = Date.now() - startTime;
            this.recordSuccess(keyIndex, responseTime);
            request.resolve(response);
        } catch (error) {
            console.error(`[API Error] Key ${keyIndex + 1} failed:`, error.message);
            const responseTime = Date.now() - startTime;
            this.recordFailure(keyIndex, error, responseTime);
            request.attempts++;

            if (request.attempts < request.maxAttempts) {
                setTimeout(() => {
                    this.requestQueue.unshift(request);
                    this.processQueue();
                }, 1000 * request.attempts);
            } else {
                const finalError = new Error(`Yêu cầu thất bại sau ${request.maxAttempts} lần thử. Lỗi cuối cùng: ${error.message}`);
                request.reject(finalError);
            }
        } finally {
            this.activeRequests.delete(request.id);
            if(this.requestQueue.length > 0) {
               setTimeout(() => this.processQueue(), 100);
            }
        }
    }

    async callGeminiApi(userMessage, conversationHistory, keyIndex) {
        const apiKey = this.apiKeys[keyIndex];
        if (!apiKey) throw new Error(`API key không hợp lệ tại index ${keyIndex}`);
        const genAI = new GoogleGenerativeAI(apiKey);
        
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: createSystemPrompt() });

        const firstUserMessageIndex = conversationHistory.findIndex(msg => msg.sender === 'user');
        const validHistorySlice = firstUserMessageIndex === -1 ? [] : conversationHistory.slice(firstUserMessageIndex);
        const history = validHistorySlice.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({ history, generationConfig: { maxOutputTokens: 1500, temperature: 0.8 } });
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    }

    recordSuccess(keyIndex, responseTime) {
        const keyState = this.keyStates[keyIndex];
        keyState.requestCount++;
        keyState.successCount++;
        keyState.failureCount = 0;
        keyState.avgResponseTime = keyState.avgResponseTime === 0 ? responseTime : (keyState.avgResponseTime + responseTime) / 2;
        if (keyState.state === 'HALF_OPEN') {
            keyState.state = 'CLOSED';
            keyState.isHealthy = true;
        }
        this.metrics.totalRequests++;
        this.metrics.successfulRequests++;
        this.updateAverageResponseTime(responseTime);
        this.updateKeyUsageStats(keyIndex);
    }

    recordFailure(keyIndex, error, responseTime) {
        const keyState = this.keyStates[keyIndex];
        keyState.requestCount++;
        keyState.failureCount++;
        keyState.lastFailure = error;

        const isCriticalError = /quota|rate limit|429|invalid|unauthorized/i.test(error.message || '');
        if (isCriticalError) keyState.failureCount += 2;

        if (keyState.failureCount >= this.failureThreshold) {
            keyState.state = 'OPEN';
            keyState.isHealthy = false;
            keyState.nextAttempt = Date.now() + this.recoveryTimeout;
        }
        this.metrics.totalRequests++;
        this.metrics.failedRequests++;
        this.updateAverageResponseTime(responseTime);
    }

    startHealthCheck() {
        setInterval(() => {
            this.keyStates.forEach((keyState, index) => {
                if (keyState.state === 'OPEN' && Date.now() >= keyState.nextAttempt) {
                    keyState.state = 'HALF_OPEN';
                    keyState.failureCount = Math.max(0, keyState.failureCount - 1);
                }
                if (keyState.state === 'CLOSED' && keyState.successCount > 10) {
                    keyState.failureCount = Math.max(0, keyState.failureCount - 1);
                }
            });
        }, this.healthCheckInterval);
    }

    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    updateAverageResponseTime(responseTime) {
        this.metrics.averageResponseTime = this.metrics.averageResponseTime === 0 ? responseTime : (this.metrics.averageResponseTime + responseTime) / 2;
    }

    updateKeyUsageStats(keyIndex) {
        const current = this.metrics.keyUsageStats.get(keyIndex) || 0;
        this.metrics.keyUsageStats.set(keyIndex, current + 1);
    }

    cleanupMetrics() {
        this.keyStates.forEach(keyState => {
            if (keyState.requestCount > 1000) {
                keyState.requestCount = Math.floor(keyState.requestCount / 2);
                keyState.successCount = Math.floor(keyState.successCount / 2);
            }
        });
    }

    getStatus() {
        return {
            keys: this.keyStates.map((state, index) => ({
                index: index + 1,
                state: state.state,
                isHealthy: state.isHealthy,
                activeRequests: this.getActiveRequestsForKey(index),
                successRate: state.requestCount > 0 ? `${((state.successCount / state.requestCount) * 100).toFixed(1)}%` : '100%',
                avgResponseTime: `${state.avgResponseTime.toFixed(0)}ms`
            })),
            queue: { size: this.requestQueue.length, maxSize: this.maxQueueSize },
            activeRequests: this.activeRequests.size,
            metrics: {
                ...this.metrics,
                successRate: this.metrics.totalRequests > 0 ? `${((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(1)}%` : '100%'
            }
        };
    }

    resetFailedKeys() {
        this.keyStates.forEach(keyState => {
            keyState.state = 'CLOSED';
            keyState.failureCount = 0;
            keyState.isHealthy = true;
            keyState.nextAttempt = null;
        });
    }
}

export const loadBalancer = new ApiLoadBalancer();

export async function getGeminiResponse(userMessage, conversationHistory = []) {
    return loadBalancer.processRequest(userMessage, conversationHistory);
}

export function getApiKeyStatus() {
    return loadBalancer.getStatus();
}

export function checkGeminiApiKey() {
    return loadBalancer.apiKeys.length > 0;
}

export function resetFailedKeys() {
    loadBalancer.resetFailedKeys();
}