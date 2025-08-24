import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled = false }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-wrapper">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={disabled}
                        className="message-input"
                        rows="3"
                        maxLength="500"
                    />
                    <div className="input-footer">
                        <span className="character-count">
                            {message.length}/500
                        </span>
                        <button
                            type="submit"
                            disabled={!message.trim() || disabled}
                            className="send-button"
                        >
                            <span className="send-icon">📤</span>
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;



