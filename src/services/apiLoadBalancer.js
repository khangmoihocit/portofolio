import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Advanced API Load Balancer với Circuit Breaker Pattern
 * Tối ưu cho multi-user concurrent requests
 */
class ApiLoadBalancer {
    constructor() {
        // API Keys configuration
        this.apiKeys = [
            import.meta.env.VITE_GEMINI_API_KEY_1 || '',
            import.meta.env.VITE_GEMINI_API_KEY || '',
            import.meta.env.VITE_GEMINI_API_KEY_2 || '',
            import.meta.env.VITE_GEMINI_API_KEY_3 || '',
            import.meta.env.VITE_GEMINI_API_KEY_4 || '',
            import.meta.env.VITE_GEMINI_API_KEY_5 || ''
        ].filter(key => key !== '');

        // Circuit breaker states cho từng key
        this.keyStates = this.apiKeys.map((_, index) => ({
            state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
            failureCount: 0,
            lastFailure: null,
            nextAttempt: null,
            requestCount: 0,
            successCount: 0,
            avgResponseTime: 0,
            isHealthy: true
        }));

        // Load balancing configuration
        this.currentKeyIndex = 0;
        this.requestQueue = [];
        this.activeRequests = new Map(); // Theo dõi requests đang chạy
        this.maxConcurrentPerKey = 3; // Tối đa 3 requests đồng thời/key
        this.maxQueueSize = 50; // Tối đa 50 requests trong queue

        // Circuit breaker configuration
        this.failureThreshold = 3; // Số lỗi liên tiếp để mở circuit
        this.recoveryTimeout = 60000; // 1 phút để thử lại
        this.healthCheckInterval = 30000; // Health check mỗi 30s

        // Performance monitoring
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            keyUsageStats: new Map()
        };

        // Start health check timer
        this.startHealthCheck();

        // Cleanup old metrics periodically
        setInterval(() => this.cleanupMetrics(), 300000); // 5 phút
    }

    /**
     * Tìm API key tối ưu nhất để sử dụng
     * @returns {number} Index của key tối ưu
     */
    selectOptimalKey() {
        const healthyKeys = this.keyStates
            .map((state, index) => ({ ...state, index }))
            .filter(key => 
                key.state === 'CLOSED' && 
                key.isHealthy &&
                this.getActiveRequestsForKey(key.index) < this.maxConcurrentPerKey
            );

        if (healthyKeys.length === 0) {
            // Nếu không có key khỏe mạnh, thử tìm key HALF_OPEN
            const halfOpenKeys = this.keyStates
                .map((state, index) => ({ ...state, index }))
                .filter(key => key.state === 'HALF_OPEN');

            if (halfOpenKeys.length > 0) {
                return halfOpenKeys[0].index;
            }

            // Fallback: tìm key có ít active requests nhất
            const availableKeys = this.keyStates
                .map((state, index) => ({
                    index,
                    activeRequests: this.getActiveRequestsForKey(index)
                }))
                .filter(key => key.activeRequests < this.maxConcurrentPerKey)
                .sort((a, b) => a.activeRequests - b.activeRequests);

            return availableKeys.length > 0 ? availableKeys[0].index : 0;
        }

        // Weighted round robin dựa trên performance
        const keyScores = healthyKeys.map(key => ({
            ...key,
            score: this.calculateKeyScore(key)
        }));

        // Sort theo score (cao nhất trước)
        keyScores.sort((a, b) => b.score - a.score);
        
        return keyScores[0].index;
    }

    /**
     * Tính điểm cho key dựa trên performance metrics
     * @param {Object} keyState - Trạng thái của key
     * @returns {number} Điểm số (càng cao càng tốt)
     */
    calculateKeyScore(keyState) {
        const successRate = keyState.requestCount > 0 ? 
            (keyState.successCount / keyState.requestCount) : 1;
        const responseTimeScore = keyState.avgResponseTime > 0 ? 
            (1000 / keyState.avgResponseTime) : 1; // Ưu tiên response time thấp
        const loadScore = 1 / (this.getActiveRequestsForKey(keyState.index) + 1);

        return (successRate * 0.5) + (responseTimeScore * 0.3) + (loadScore * 0.2);
    }

    /**
     * Đếm số active requests cho một key
     * @param {number} keyIndex - Index của key
     * @returns {number} Số requests đang active
     */
    getActiveRequestsForKey(keyIndex) {
        return Array.from(this.activeRequests.values())
            .filter(req => req.keyIndex === keyIndex).length;
    }

    /**
     * Xử lý request với load balancing và circuit breaker
     * @param {string} userMessage - Message từ user
     * @param {Array} conversationHistory - Lịch sử chat
     * @param {string} requestId - Unique request ID
     * @returns {Promise<string>} Response từ AI
     */
    async processRequest(userMessage, conversationHistory = [], requestId = null) {
        if (!requestId) {
            requestId = this.generateRequestId();
        }

        // Kiểm tra queue size
        if (this.requestQueue.length >= this.maxQueueSize) {
            throw new Error('Hệ thống đang quá tải. Vui lòng thử lại sau ít phút.');
        }

        return new Promise((resolve, reject) => {
            const request = {
                id: requestId,
                userMessage,
                conversationHistory,
                resolve,
                reject,
                timestamp: Date.now(),
                attempts: 0,
                maxAttempts: 3
            };

            this.requestQueue.push(request);
            this.processQueue();
        });
    }

    /**
     * Xử lý queue requests
     */
    async processQueue() {
        while (this.requestQueue.length > 0 && this.activeRequests.size < this.maxConcurrentPerKey * this.apiKeys.length) {
            const request = this.requestQueue.shift();
            if (!request) continue;

            const keyIndex = this.selectOptimalKey();
            const keyState = this.keyStates[keyIndex];

            // Circuit breaker check
            if (keyState.state === 'OPEN') {
                if (Date.now() < keyState.nextAttempt) {
                    // Re-queue nếu circuit vẫn đang mở
                    this.requestQueue.unshift(request);
                    break;
                } else {
                    // Chuyển sang HALF_OPEN để test
                    keyState.state = 'HALF_OPEN';
                    console.log(`🔄 Circuit breaker cho key ${keyIndex + 1} chuyển sang HALF_OPEN`);
                }
            }

            this.executeRequest(request, keyIndex);
        }
    }

    /**
     * Thực thi request với key đã chọn
     * @param {Object} request - Request object
     * @param {number} keyIndex - Index của key sử dụng
     */
    async executeRequest(request, keyIndex) {
        const startTime = Date.now();
        request.keyIndex = keyIndex;

        // Add to active requests
        this.activeRequests.set(request.id, request);

        try {
            const response = await this.callGeminiApi(
                request.userMessage, 
                request.conversationHistory, 
                keyIndex
            );

            const responseTime = Date.now() - startTime;
            this.recordSuccess(keyIndex, responseTime);
            
            console.log(`✅ Request ${request.id} hoàn thành với key ${keyIndex + 1} (${responseTime}ms)`);
            request.resolve(response);

        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.recordFailure(keyIndex, error, responseTime);

            // Retry logic
            request.attempts++;
            if (request.attempts < request.maxAttempts) {
                console.log(`🔄 Retry request ${request.id} (${request.attempts}/${request.maxAttempts})`);
                
                // Re-queue with delay
                setTimeout(() => {
                    this.requestQueue.unshift(request);
                    this.processQueue();
                }, 1000 * request.attempts);
            } else {
                console.error(`❌ Request ${request.id} thất bại sau ${request.maxAttempts} lần thử`);
                request.reject(error);
            }

        } finally {
            // Remove from active requests
            this.activeRequests.delete(request.id);
            
            // Continue processing queue
            setTimeout(() => this.processQueue(), 100);
        }
    }

    /**
     * Gọi Gemini API với key cụ thể
     * @param {string} userMessage - Message từ user
     * @param {Array} conversationHistory - Lịch sử chat
     * @param {number} keyIndex - Index của key
     * @returns {Promise<string>} Response từ AI
     */
    async callGeminiApi(userMessage, conversationHistory, keyIndex) {
        const apiKey = this.apiKeys[keyIndex];
        const genAI = new GoogleGenerativeAI(apiKey);
        
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: this.createSystemPrompt(),
        });

        // Process conversation history
        const firstUserMessageIndex = conversationHistory.findIndex(msg => msg.sender === 'user');
        const validHistorySlice = firstUserMessageIndex === -1 
            ? [] 
            : conversationHistory.slice(firstUserMessageIndex);

        const history = validHistorySlice.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({ 
            history,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            }
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        
        return response.text();
    }

    /**
     * Ghi nhận thành công
     * @param {number} keyIndex - Index của key
     * @param {number} responseTime - Thời gian response
     */
    recordSuccess(keyIndex, responseTime) {
        const keyState = this.keyStates[keyIndex];
        
        keyState.requestCount++;
        keyState.successCount++;
        keyState.failureCount = 0; // Reset failure count
        
        // Update average response time
        keyState.avgResponseTime = keyState.avgResponseTime === 0 ? 
            responseTime : 
            (keyState.avgResponseTime + responseTime) / 2;

        // Circuit breaker state management
        if (keyState.state === 'HALF_OPEN') {
            keyState.state = 'CLOSED';
            keyState.isHealthy = true;
            console.log(`✅ Circuit breaker cho key ${keyIndex + 1} đã CLOSED`);
        }

        // Update global metrics
        this.metrics.totalRequests++;
        this.metrics.successfulRequests++;
        this.updateAverageResponseTime(responseTime);
        this.updateKeyUsageStats(keyIndex);
    }

    /**
     * Ghi nhận lỗi
     * @param {number} keyIndex - Index của key
     * @param {Error} error - Error object
     * @param {number} responseTime - Thời gian response
     */
    recordFailure(keyIndex, error, responseTime) {
        const keyState = this.keyStates[keyIndex];
        
        keyState.requestCount++;
        keyState.failureCount++;
        keyState.lastFailure = error;

        const errorMessage = error.message?.toLowerCase() || '';
        
        // Kiểm tra loại lỗi để quyết định circuit breaker
        const isCriticalError = 
            errorMessage.includes('quota') || 
            errorMessage.includes('rate limit') || 
            errorMessage.includes('429') ||
            errorMessage.includes('invalid') ||
            errorMessage.includes('unauthorized');

        if (isCriticalError) {
            keyState.failureCount += 2; // Tăng nặng hơn cho critical errors
        }

        // Circuit breaker logic
        if (keyState.failureCount >= this.failureThreshold) {
            keyState.state = 'OPEN';
            keyState.isHealthy = false;
            keyState.nextAttempt = Date.now() + this.recoveryTimeout;
            
            console.warn(`🚫 Circuit breaker cho key ${keyIndex + 1} đã MỞ (${keyState.failureCount} lỗi)`);
        }

        // Update global metrics
        this.metrics.totalRequests++;
        this.metrics.failedRequests++;
        this.updateAverageResponseTime(responseTime);
    }

    /**
     * Health check định kỳ
     */
    startHealthCheck() {
        setInterval(() => {
            this.keyStates.forEach((keyState, index) => {
                // Auto recovery cho keys đã hết timeout
                if (keyState.state === 'OPEN' && Date.now() >= keyState.nextAttempt) {
                    keyState.state = 'HALF_OPEN';
                    keyState.failureCount = Math.max(0, keyState.failureCount - 1);
                    console.log(`🔄 Key ${index + 1} sẵn sàng để test lại (HALF_OPEN)`);
                }

                // Reset failure count cho keys hoạt động tốt
                if (keyState.state === 'CLOSED' && keyState.successCount > 10) {
                    keyState.failureCount = Math.max(0, keyState.failureCount - 1);
                }
            });
        }, this.healthCheckInterval);
    }

    /**
     * Generate unique request ID
     * @returns {string} Request ID
     */
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Update average response time
     * @param {number} responseTime - Response time
     */
    updateAverageResponseTime(responseTime) {
        if (this.metrics.averageResponseTime === 0) {
            this.metrics.averageResponseTime = responseTime;
        } else {
            this.metrics.averageResponseTime = 
                (this.metrics.averageResponseTime + responseTime) / 2;
        }
    }

    /**
     * Update key usage statistics
     * @param {number} keyIndex - Key index
     */
    updateKeyUsageStats(keyIndex) {
        const current = this.metrics.keyUsageStats.get(keyIndex) || 0;
        this.metrics.keyUsageStats.set(keyIndex, current + 1);
    }

    /**
     * Clean up old metrics
     */
    cleanupMetrics() {
        // Reset metrics mỗi 5 phút để tránh memory leak
        this.keyStates.forEach(keyState => {
            if (keyState.requestCount > 1000) {
                keyState.requestCount = Math.floor(keyState.requestCount / 2);
                keyState.successCount = Math.floor(keyState.successCount / 2);
            }
        });
    }

    /**
     * Create system prompt (simplified)
     * @returns {string} System prompt
     */
    createSystemPrompt() {
        return `Bạn là trợ lý AI của Phạm Văn Khang, một Backend/Frontend Developer tài năng. Hãy trả lời ngắn gọn, thân thiện và chuyên nghiệp.`;
    }

    /**
     * Get current status
     * @returns {Object} Current status
     */
    getStatus() {
        return {
            keys: this.keyStates.map((state, index) => ({
                index: index + 1,
                state: state.state,
                isHealthy: state.isHealthy,
                activeRequests: this.getActiveRequestsForKey(index),
                successRate: state.requestCount > 0 ? 
                    ((state.successCount / state.requestCount) * 100).toFixed(1) + '%' : '100%',
                avgResponseTime: state.avgResponseTime.toFixed(0) + 'ms'
            })),
            queue: {
                size: this.requestQueue.length,
                maxSize: this.maxQueueSize
            },
            activeRequests: this.activeRequests.size,
            metrics: {
                ...this.metrics,
                successRate: this.metrics.totalRequests > 0 ? 
                    ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(1) + '%' : '100%'
            }
        };
    }

    /**
     * Manual reset cho failed keys
     */
    resetFailedKeys() {
        this.keyStates.forEach(keyState => {
            keyState.state = 'CLOSED';
            keyState.failureCount = 0;
            keyState.isHealthy = true;
            keyState.nextAttempt = null;
        });
        console.log('🔄 Đã reset tất cả failed keys');
    }
}

// Singleton instance
export const loadBalancer = new ApiLoadBalancer();

// Export wrapper functions
export async function getGeminiResponse(userMessage, conversationHistory = []) {
    return loadBalancer.processRequest(userMessage, conversationHistory);
}

export function getApiKeyStatus() {
    const status = loadBalancer.getStatus();
    return {
        total: status.keys.length,
        available: status.keys.filter(k => k.isHealthy).length,
        failed: status.keys.filter(k => !k.isHealthy).length,
        currentIndex: 1, // Simplified
        failedKeyIndexes: status.keys
            .filter(k => !k.isHealthy)
            .map(k => k.index)
    };
}

export function checkGeminiApiKey() {
    return loadBalancer.apiKeys.length > 0;
}

export function resetFailedKeys() {
    loadBalancer.resetFailedKeys();
}