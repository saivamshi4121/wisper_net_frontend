import React, { useState } from 'react';
import { verifyBlockchainIntegrity, getBlockchainStats } from '../utils/blockchain';
import './BlockchainExplorer.css';

const BlockchainExplorer = ({ blockchain }) => {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    
    const integrityCheck = verifyBlockchainIntegrity(blockchain);
    const stats = getBlockchainStats(blockchain);

    const handleBlockClick = (block) => {
        setSelectedBlock(block);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setSelectedBlock(null);
    };

    return (
        <div className="blockchain-explorer">
            <div className="explorer-header">
                <h3>🔗 Blockchain Explorer</h3>
                <div className="integrity-status">
                    {integrityCheck.valid ? (
                        <span className="status-valid">✓ Chain Valid</span>
                    ) : (
                        <span className="status-invalid">✗ Chain Invalid</span>
                    )}
                </div>
            </div>

            <div className="stats-overview">
                <div className="stat-item">
                    <span className="stat-label">Total Blocks:</span>
                    <span className="stat-value">{stats.totalBlocks}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Unique Senders:</span>
                    <span className="stat-value">{stats.uniqueSenders}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Messages:</span>
                    <span className="stat-value">{stats.totalMessages}</span>
                </div>
            </div>

            <div className="blockchain-visualization">
                <div className="chain-container">
                    {blockchain.map((block, index) => (
                        <div
                            key={block.hash}
                            className={`block-item ${selectedBlock?.hash === block.hash ? 'selected' : ''}`}
                            onClick={() => handleBlockClick(block)}
                        >
                            <div className="block-index">#{block.index}</div>
                            <div className="block-sender">{block.senderId === 'genesis' ? 'Genesis' : block.senderId.replace('user_', 'User ')}</div>
                            <div className="block-message">{block.message.substring(0, 30)}...</div>
                            <div className="block-hash">{block.hash.substring(0, 8)}...</div>
                            {index < blockchain.length - 1 && (
                                <div className="chain-link">↓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {showDetails && selectedBlock && (
                <div className="block-details-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4>Block #{selectedBlock.index} Details</h4>
                            <button className="close-button" onClick={closeDetails}>×</button>
                        </div>
                        
                        <div className="block-details-content">
                            <div className="detail-section">
                                <h5>Basic Information</h5>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Index:</span>
                                        <span className="detail-value">{selectedBlock.index}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Timestamp:</span>
                                        <span className="detail-value">{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Sender:</span>
                                        <span className="detail-value">{selectedBlock.senderId}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Message:</span>
                                        <span className="detail-value message-text">{selectedBlock.message}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Cryptographic Data</h5>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Hash:</span>
                                        <span className="detail-value hash">{selectedBlock.hash}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Previous Hash:</span>
                                        <span className="detail-value hash">{selectedBlock.previousHash}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Signature:</span>
                                        <span className="detail-value signature">{selectedBlock.signature}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Verification</h5>
                                <div className="verification-status">
                                    {verifyBlockchainIntegrity([selectedBlock]).valid ? (
                                        <span className="status-valid">✓ Block is valid</span>
                                    ) : (
                                        <span className="status-invalid">✗ Block is invalid</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockchainExplorer;



