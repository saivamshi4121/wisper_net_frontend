import React from 'react';
import { getUserDisplayName, formatTimestamp, verifyBlockSignature } from '../utils/blockchain';
import './Message.css';

const Message = ({ block, isOwnMessage, recipientName = 'Everyone' }) => {
    const isVerified = verifyBlockSignature(block);
    const displayName = getUserDisplayName(block.senderId);
    const timestamp = formatTimestamp(block.timestamp);

    return (
        <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
            <div className="message-header">
                <span className="sender-name">{displayName}</span>
                <span className="timestamp">{timestamp}</span>
                {block.recipientId && block.recipientId !== 'broadcast' && (
                    <span className="recipient-info" title="Message recipient">
                        → {recipientName}
                    </span>
                )}
                {isVerified && (
                    <span className="verification-status verified" title="Message verified">
                        ✓
                    </span>
                )}
            </div>
            
            <div className="message-content">
                {block.message}
            </div>
        </div>
    );
};

export default Message;



