import React, { useState, useEffect } from 'react';
import { checkApiHealth, syncBlockchainToServer } from '../services/api';
import './SyncStatus.css';

const SyncStatus = ({ blockchain, onSyncComplete }) => {
    const [serverStatus, setServerStatus] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncResult, setLastSyncResult] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        checkServerStatus();
        const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const checkServerStatus = async () => {
        try {
            const isAvailable = await checkApiHealth();
            setServerStatus({ 
                available: isAvailable, 
                serverBlockCount: 0 // We'll get this from sync result
            });
        } catch (error) {
            setServerStatus({ available: false, error: error.message });
        }
    };

    const handleSync = async () => {
        if (!blockchain || blockchain.length === 0) {
            setLastSyncResult({ success: false, message: 'No blockchain data to sync' });
            return;
        }

        setIsSyncing(true);
        try {
            const result = await syncBlockchainToServer(blockchain);
            setLastSyncResult({
                success: true,
                message: result.message,
                updated: result.updated,
                serverBlockCount: result.blockchainLength
            });
            
            if (onSyncComplete) {
                onSyncComplete(result);
            }
            
            // Refresh server status after sync
            setTimeout(checkServerStatus, 1000);
        } catch (error) {
            setLastSyncResult({
                success: false,
                message: error.message
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const getStatusIcon = () => {
        if (!serverStatus) return '⏳';
        return serverStatus.available ? '🟢' : '🔴';
    };

    const getStatusText = () => {
        if (!serverStatus) return 'Checking...';
        return serverStatus.available ? 'Connected' : 'Disconnected';
    };

    return (
        <div className="sync-status">
            <div className="status-header">
                <div className="status-indicator">
                    <span className="status-icon">{getStatusIcon()}</span>
                    <span className="status-text">{getStatusText()}</span>
                </div>
                
                <div className="status-actions">
                    <button
                        onClick={checkServerStatus}
                        className="refresh-button"
                        title="Refresh status"
                    >
                        🔄
                    </button>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="details-button"
                        title="Show details"
                    >
                        {showDetails ? '−' : '+'}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="status-details">
                    {serverStatus?.available ? (
                        <div className="server-info">
                            <div className="info-row">
                                <span className="info-label">Server:</span>
                                <span className="info-value">localhost:3001</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Server Blocks:</span>
                                <span className="info-value">{serverStatus.serverBlockCount || 0}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Local Blocks:</span>
                                <span className="info-value">{blockchain?.length || 0}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="server-error">
                            <span className="error-icon">⚠️</span>
                            <span className="error-text">
                                {serverStatus?.error || 'Unable to connect to server'}
                            </span>
                        </div>
                    )}

                    <div className="sync-section">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing || !serverStatus?.available || !blockchain?.length}
                            className="sync-button"
                        >
                            {isSyncing ? (
                                <>
                                    <span className="spinner">⏳</span>
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <span className="sync-icon">📡</span>
                                    Sync to Server
                                </>
                            )}
                        </button>
                    </div>

                    {lastSyncResult && (
                        <div className={`sync-result ${lastSyncResult.success ? 'success' : 'error'}`}>
                            <span className="result-icon">
                                {lastSyncResult.success ? '✅' : '❌'}
                            </span>
                            <span className="result-message">{lastSyncResult.message}</span>
                            {lastSyncResult.updated && (
                                <span className="result-details">
                                    Server now has {lastSyncResult.serverBlockCount} blocks
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SyncStatus;



