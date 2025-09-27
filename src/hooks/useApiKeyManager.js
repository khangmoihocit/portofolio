import { useState, useEffect } from 'react';
import { getApiKeyStatus, resetFailedKeys } from '../services/geminiService';

/**
 * Hook để quản lý trạng thái API keys
 * @returns {Object} Trạng thái và các hàm quản lý API keys
 */
export function useApiKeyManager() {
    const [keyStatus, setKeyStatus] = useState({
        total: 0,
        available: 0,
        failed: 0,
        currentIndex: 1,
        failedKeyIndexes: []
    });

    /**
     * Cập nhật trạng thái API keys
     */
    const updateKeyStatus = () => {
        const status = getApiKeyStatus();
        setKeyStatus(status);
    };

    /**
     * Reset các API keys bị lỗi
     */
    const handleResetFailedKeys = () => {
        resetFailedKeys();
        updateKeyStatus();
    };

    // Cập nhật trạng thái khi component mount
    useEffect(() => {
        updateKeyStatus();
        
        // Tự động cập nhật trạng thái mỗi 30 giây
        const interval = setInterval(updateKeyStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return {
        keyStatus,
        updateKeyStatus,
        resetFailedKeys: handleResetFailedKeys,
        isHealthy: keyStatus.available > 0,
        healthPercentage: keyStatus.total > 0 ? (keyStatus.available / keyStatus.total) * 100 : 0
    };
}