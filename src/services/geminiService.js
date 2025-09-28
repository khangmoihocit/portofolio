import { loadBalancer } from './apiLoadBalancer';
import { createSystemPrompt, PERSONAL_INFO } from './promptService';

export { getGeminiResponse, getApiKeyStatus, checkGeminiApiKey, resetFailedKeys } from './apiLoadBalancer';

/**
 * Lấy thông tin chi tiết về load balancer
 * @returns {Object} Detailed status
 */
export function getDetailedLoadBalancerStatus() {
    return loadBalancer.getStatus();
}

/**
 * Hàm gọi Gemini API với hệ thống retry và rotation API key
 * @param {string} userMessage - Tin nhắn từ người dùng.
 * @param {Array<Object>} conversationHistory - Lịch sử cuộc trò chuyện.
 * @returns {Promise<string>} - Câu trả lời từ AI.
 * @deprecated Sử dụng load balancer thay thế - kept for backward compatibility
 */
export async function getGeminiResponseLegacy(userMessage, conversationHistory = []) {
    return getGeminiResponse(userMessage, conversationHistory);
}

export { createSystemPrompt, PERSONAL_INFO };