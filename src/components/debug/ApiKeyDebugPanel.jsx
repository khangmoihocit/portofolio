import React, { useState, useEffect } from 'react';
import { useApiKeyManager } from '../../hooks/useApiKeyManager';
import { getDetailedLoadBalancerStatus, loadBalancer } from '../../services/apiLoadBalancer';

/**
 * Enhanced Debug Panel với thông tin chi tiết về Load Balancer
 */
const ApiKeyDebugPanel = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRunningTest, setIsRunningTest] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [logs, setLogs] = useState([]);
    const [detailedStatus, setDetailedStatus] = useState(null);
    const [refreshInterval, setRefreshInterval] = useState(null);
    
    const { keyStatus, updateKeyStatus, resetFailedKeys, isHealthy, healthPercentage } = useApiKeyManager();

    // Chỉ hiển thị trong development mode
    const isDev = import.meta.env.DEV;

    // Auto-refresh detailed status
    useEffect(() => {
        if (isVisible && isDev) {
            const updateDetailedStatus = () => {
                setDetailedStatus(getDetailedLoadBalancerStatus());
            };

            updateDetailedStatus();
            const interval = setInterval(updateDetailedStatus, 2000); // Refresh mỗi 2 giây
            setRefreshInterval(interval);

            return () => {
                if (interval) clearInterval(interval);
            };
        }
    }, [isVisible, isDev]);

    // Cleanup interval when component unmounts
    useEffect(() => {
        return () => {
            if (refreshInterval) clearInterval(refreshInterval);
        };
    }, [refreshInterval]);

    const runStressTest = async (concurrent = 5) => {
        setIsRunningTest(true);
        setLogs([]);
        try {
            // Tạo nhiều requests đồng thời
            const promises = Array.from({ length: concurrent }, (_, i) => 
                loadBalancer.processRequest(`Test concurrent ${i + 1}: Kỹ năng của Khang là gì?`)
                    .then(response => ({ success: true, response: response.length }))
                    .catch(error => ({ success: false, error: error.message }))
            );

            const results = await Promise.allSettled(promises);
            const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
            const failed = results.length - successful;

            setTestResults({
                totalRequests: results.length,
                successful,
                failed,
                concurrent: true
            });

            setLogs(prev => [...prev, 
                `${new Date().toLocaleTimeString()}: 🧪 Stress test hoàn thành: ${successful}/${results.length} thành công`
            ]);

        } catch (error) {
            console.error('Stress test failed:', error);
            setLogs(prev => [...prev, 
                `${new Date().toLocaleTimeString()}: ❌ Stress test thất bại: ${error.message}`
            ]);
        } finally {
            setIsRunningTest(false);
            updateKeyStatus();
        }
    };

    const runBasicTest = async () => {
        setIsRunningTest(true);
        setLogs([]);
        try {
            const response = await loadBalancer.processRequest("Test: Giới thiệu về Khang");
            setTestResults({
                totalRequests: 1,
                successful: 1,
                failed: 0,
                responseLength: response.length
            });
            setLogs(prev => [...prev, 
                `${new Date().toLocaleTimeString()}: ✅ Basic test thành công (${response.length} chars)`
            ]);
        } catch (error) {
            setTestResults({
                totalRequests: 1,
                successful: 0,
                failed: 1,
                error: error.message
            });
            setLogs(prev => [...prev, 
                `${new Date().toLocaleTimeString()}: ❌ Basic test thất bại: ${error.message}`
            ]);
        } finally {
            setIsRunningTest(false);
            updateKeyStatus();
        }
    };

    if (!isDev) return null;

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    backgroundColor: isHealthy ? '#4CAF50' : '#FF5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                }}
                title="Load Balancer Debug Panel"
            >
                🚀
            </button>

            {/* Enhanced Debug Panel */}
            {isVisible && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    width: '500px',
                    maxHeight: '85vh',
                    backgroundColor: '#1a1a2e',
                    color: '#eee',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    padding: '20px',
                    zIndex: 9998,
                    overflow: 'auto',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                        <h3 style={{ color: '#64ffda', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🚀 Load Balancer Debug
                            <span style={{ fontSize: '12px', color: '#888' }}>v2.0</span>
                        </h3>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        gap: '10px', 
                        marginBottom: '20px',
                        fontSize: '12px'
                    }}>
                        <div style={{ backgroundColor: '#0a1628', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ color: '#64ffda', fontWeight: 'bold' }}>{keyStatus.total}</div>
                            <div>Total Keys</div>
                        </div>
                        <div style={{ backgroundColor: isHealthy ? '#0a2817' : '#2d0a0a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ color: isHealthy ? '#4CAF50' : '#FF5722', fontWeight: 'bold' }}>{keyStatus.available}</div>
                            <div>Available</div>
                        </div>
                        <div style={{ backgroundColor: '#0a1628', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{keyStatus.failed}</div>
                            <div>Failed</div>
                        </div>
                    </div>

                    {/* Health Bar */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>System Health</span>
                            <span>{Math.round(healthPercentage)}%</span>
                        </div>
                        <div style={{ 
                            width: '100%', 
                            height: '8px', 
                            backgroundColor: '#333', 
                            borderRadius: '4px', 
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${healthPercentage}%`,
                                height: '100%',
                                backgroundColor: healthPercentage > 75 ? '#4CAF50' : healthPercentage > 50 ? '#FF9800' : '#FF5722',
                                transition: 'all 0.3s ease'
                            }}></div>
                        </div>
                    </div>

                    {/* Detailed Status */}
                    {detailedStatus && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#64ffda', margin: '0 0 10px 0', fontSize: '14px' }}>🔍 Detailed Status</h4>
                            
                            {/* Queue Info */}
                            <div style={{ 
                                backgroundColor: '#0a1628', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                marginBottom: '10px' 
                            }}>
                                <div style={{ fontSize: '12px', marginBottom: '5px', color: '#64ffda' }}>
                                    📝 Queue: {detailedStatus.queue.size}/{detailedStatus.queue.maxSize} | 
                                    Active: {detailedStatus.activeRequests}
                                </div>
                                <div style={{ fontSize: '11px', color: '#888' }}>
                                    Success Rate: {detailedStatus.metrics.successRate}
                                </div>
                            </div>

                            {/* Keys Status */}
                            <div style={{ fontSize: '11px' }}>
                                {detailedStatus.keys.map((key, index) => (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        marginBottom: '3px',
                                        padding: '5px 8px',
                                        backgroundColor: key.isHealthy ? '#0a2817' : '#2d0a0a',
                                        borderRadius: '4px'
                                    }}>
                                        <span>
                                            🔑 Key #{key.index} 
                                            <span style={{ 
                                                color: key.state === 'CLOSED' ? '#4CAF50' : 
                                                       key.state === 'HALF_OPEN' ? '#FF9800' : '#FF5722',
                                                fontSize: '10px',
                                                marginLeft: '5px'
                                            }}>
                                                {key.state}
                                            </span>
                                        </span>
                                        <span style={{ color: '#888' }}>
                                            {key.activeRequests} active | {key.successRate} | {key.avgResponseTime}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Test Controls */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <button
                                onClick={runBasicTest}
                                disabled={isRunningTest}
                                style={{
                                    backgroundColor: '#64ffda',
                                    color: '#1a1a2e',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    cursor: isRunningTest ? 'not-allowed' : 'pointer',
                                    fontSize: '11px',
                                    opacity: isRunningTest ? 0.6 : 1
                                }}
                            >
                                Basic Test
                            </button>
                            <button
                                onClick={() => runStressTest(3)}
                                disabled={isRunningTest}
                                style={{
                                    backgroundColor: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    cursor: isRunningTest ? 'not-allowed' : 'pointer',
                                    fontSize: '11px',
                                    opacity: isRunningTest ? 0.6 : 1
                                }}
                            >
                                3x Concurrent
                            </button>
                            <button
                                onClick={() => runStressTest(8)}
                                disabled={isRunningTest}
                                style={{
                                    backgroundColor: '#e63946',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    cursor: isRunningTest ? 'not-allowed' : 'pointer',
                                    fontSize: '11px',
                                    opacity: isRunningTest ? 0.6 : 1
                                }}
                            >
                                8x Stress
                            </button>
                        </div>
                        
                        <button
                            onClick={() => {
                                resetFailedKeys();
                                setTestResults(null);
                                setLogs([]);
                            }}
                            style={{
                                backgroundColor: '#ffd93d',
                                color: '#1a1a2e',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                width: '100%'
                            }}
                        >
                            🔄 Reset All
                        </button>
                    </div>

                    {/* Running Indicator */}
                    {isRunningTest && (
                        <div style={{ 
                            marginBottom: '20px', 
                            color: '#64ffda', 
                            textAlign: 'center',
                            padding: '10px',
                            backgroundColor: '#0a1628',
                            borderRadius: '6px'
                        }}>
                            🧪 Running tests... Please wait
                            <div style={{ fontSize: '10px', marginTop: '5px', color: '#888' }}>
                                Testing load balancer with multiple concurrent requests
                            </div>
                        </div>
                    )}

                    {/* Test Results */}
                    {testResults && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#64ffda', margin: '0 0 10px 0', fontSize: '14px' }}>📊 Test Results</h4>
                            <div style={{ 
                                backgroundColor: '#0a1628', 
                                padding: '10px', 
                                borderRadius: '6px',
                                fontSize: '12px' 
                            }}>
                                <div>✅ Success: {testResults.successful}/{testResults.totalRequests}</div>
                                <div>❌ Failed: {testResults.failed}/{testResults.totalRequests}</div>
                                {testResults.concurrent && (
                                    <div style={{ color: '#64ffda' }}>🚀 Concurrent test completed</div>
                                )}
                                {testResults.responseLength && (
                                    <div>📏 Response: {testResults.responseLength} chars</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Logs */}
                    {logs.length > 0 && (
                        <div>
                            <h4 style={{ color: '#64ffda', margin: '0 0 10px 0', fontSize: '14px' }}>📜 Logs</h4>
                            <div style={{ 
                                maxHeight: '150px', 
                                overflow: 'auto', 
                                fontSize: '10px', 
                                backgroundColor: '#0a0a1e', 
                                padding: '10px', 
                                borderRadius: '4px',
                                border: '1px solid #333'
                            }}>
                                {logs.map((log, index) => (
                                    <div key={index} style={{ 
                                        marginBottom: '2px',
                                        paddingBottom: '2px',
                                        borderBottom: index < logs.length - 1 ? '1px solid #333' : 'none'
                                    }}>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ApiKeyDebugPanel;