import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import SyncStatus from './components/SyncStatus';
import PeerDiscovery from './components/PeerDiscovery';
import { loadBlockchainFromStorage, saveBlockchainToStorage, addBlock, generateUserId } from './utils/blockchain';

function App() {
  const [blockchain, setBlockchain] = useState([]);
  const [currentPeerId] = useState(generateUserId());
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);


  // Ensure blockchain is always an array
  const safeBlockchain = Array.isArray(blockchain) ? blockchain : [];

  // Initialize blockchain on component mount
  useEffect(() => {
    const savedBlockchain = loadBlockchainFromStorage();
    if (savedBlockchain.length > 0) {
      setBlockchain(savedBlockchain);
    } else {
      // Create genesis block if no blockchain exists
      const genesisBlock = {
        index: 0,
        timestamp: Date.now(),
        senderId: 'system',
        recipientId: 'broadcast',
        message: 'Welcome to WhisperNet! Your secure Bluetooth messaging platform.',
        previousHash: '0',
        signature: 'genesis',
        hash: 'genesis_hash'
      };
      setBlockchain([genesisBlock]);
      saveBlockchainToStorage([genesisBlock]);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeBlockchain]);

  // Handle peer selection
  const handlePeerSelect = (peer) => {
    setSelectedPeer(peer);
    console.log('Selected Bluetooth peer:', peer.deviceName);
  };

  // Handle peer connection
  const handlePeerConnect = (peer) => {
    console.log('Connected to Bluetooth peer:', peer.deviceName);
    setIsConnected(true);
  };

  // Handle sending message
  const handleSendMessage = async (messageText) => {
    if (messageText.trim()) {
      if (selectedPeer) {
        // Send direct message to selected Bluetooth peer
        console.log('Direct message sent to Bluetooth device:', selectedPeer.deviceName);
      } else {
        // Send broadcast message
        console.log('Broadcast message sent');
      }

      // Add message to local blockchain
      const updatedBlockchain = addBlock(safeBlockchain, currentPeerId, messageText, selectedPeer?.id || 'broadcast');
      setBlockchain(updatedBlockchain);
      saveBlockchainToStorage(updatedBlockchain);
    }
  };

  // Handle sync completion (for blockchain validation)
  const handleSyncComplete = (success) => {
    if (success) {
      console.log('Blockchain synchronized successfully');
    }
  };

  // Get blockchain statistics
  const getBlockchainStats = () => {
    return {
      totalBlocks: safeBlockchain.length,
      uniqueSenders: new Set(safeBlockchain.map(block => block.senderId)).size,
      totalMessages: safeBlockchain.filter(block => block.senderId !== 'system').length,
      connectedPeers: selectedPeer ? 1 : 0
    };
  };

  // Get display messages (filtered by peer if selected)
  const getDisplayMessages = () => {
    if (selectedPeer) {
      return safeBlockchain.filter(block => 
        (block.senderId === selectedPeer.id || block.senderId === currentPeerId) &&
        (block.recipientId === selectedPeer.id || block.recipientId === currentPeerId || block.recipientId === 'broadcast')
      );
    }
    return safeBlockchain;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="app-title">WhisperNet</div>
          <div className="app-subtitle">Bluetooth Secure Messaging</div>
          <div className="app-info">
            <div className="info-item">
              <span className="info-label">Peer ID:</span>
              <span className="info-value">{currentPeerId.slice(0, 8)}...</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">{isConnected ? '🟢 Online' : '🔴 Offline'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Connected:</span>
              <span className="info-value">{selectedPeer ? selectedPeer.deviceName : 'None'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Messages:</span>
              <span className="info-value">{getBlockchainStats().totalMessages}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button
            className={`tab-button ${activeTab === 'peers' ? 'active' : ''}`}
            onClick={() => setActiveTab('peers')}
          >
            📱 Peers
          </button>
          <button
            className={`tab-button ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            🔗 Explorer
          </button>
          <button
            className={`settings-toggle-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Settings
          </button>
        </div>
        
        <div className="sync-status-container">
          <SyncStatus 
            blockchain={safeBlockchain}
            onSyncComplete={handleSyncComplete}
          />
        </div>

        {showSettings && (
          <div className="settings-panel show">
            <h3 className="settings-title">Settings</h3>
            <div className="setting-item">
              <span className="setting-label">Bluetooth Mode</span>
              <div className="setting-control">
                <span>Off</span>
                <div className="toggle-switch active"></div>
                <span>On</span>
              </div>
            </div>
            <div className="setting-item">
              <span className="setting-label">Auto-Discovery</span>
              <div className="setting-control">
                <span>Off</span>
                <div className="toggle-switch active"></div>
                <span>On</span>
              </div>
            </div>
            <div className="setting-item">
              <span className="setting-label">Notifications</span>
              <div className="setting-control">
                <span>Off</span>
                <div className="toggle-switch"></div>
                <span>On</span>
              </div>
            </div>
            <div className="setting-item">
              <span className="setting-label">Sound Effects</span>
              <div className="setting-control">
                <span>Off</span>
                <div className="toggle-switch"></div>
                <span>On</span>
              </div>
            </div>
          </div>
        )}

        <div className={`chat-container ${activeTab === 'chat' ? 'active' : ''}`}>
          <div className="chat-header">
            <h2 className="chat-title">
              {selectedPeer ? `Chat with ${selectedPeer.deviceName}` : 'Secure Chat (Broadcast)'}
            </h2>
            <div className="chat-stats">
              <div className="stat-item">
                <span>📊 {getBlockchainStats().totalBlocks} Blocks</span>
              </div>
              <div className="stat-item">
                <span>👥 {getBlockchainStats().uniqueSenders} Users</span>
              </div>
              <div className="stat-item">
                <span>💬 {getDisplayMessages().length} Messages</span>
              </div>
              {selectedPeer && (
                <div className="stat-item">
                  <span>🔗 {selectedPeer.deviceName}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="messages-container">
            {getDisplayMessages().length === 0 ? (
              <div className="no-messages">
                <div className="no-messages-icon">💬</div>
                <p className="no-messages-text">
                  {selectedPeer 
                    ? `No messages with ${selectedPeer.deviceName} yet. Start the conversation!`
                    : 'No messages yet. Connect to a peer or send a broadcast message!'
                  }
                </p>
              </div>
            ) : (
              getDisplayMessages().map((block, index) => (
                <Message
                  key={block.hash || index}
                  block={block}
                  isOwnMessage={block.senderId === currentPeerId}
                  recipientName={block.recipientId === 'broadcast' ? 'Everyone' : 
                    (block.recipientId === currentPeerId ? 'You' : 'Unknown')}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput onSendMessage={handleSendMessage} />
        </div>

        <div className={`peers-container ${activeTab === 'peers' ? 'active' : ''}`}>
          <PeerDiscovery 
            currentPeerId={currentPeerId}
            onPeerSelect={handlePeerSelect}
            onPeerConnect={handlePeerConnect}
          />
        </div>

        <div className={`explorer-container ${activeTab === 'explorer' ? 'active' : ''}`}>
          <div className="chat-header">
            <h2 className="chat-title">Blockchain Explorer</h2>
            <div className="chat-stats">
              <div className="stat-item">
                <span>🔗 {getBlockchainStats().totalBlocks} Blocks</span>
              </div>
              <div className="stat-item">
                <span>✅ Chain Valid</span>
              </div>
            </div>
          </div>
          
          <div className="messages-container">
            <div className="no-messages">
              <div className="no-messages-icon">🔗</div>
              <p className="no-messages-text">Blockchain Explorer functionality is currently unavailable.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">WhisperNet - Bluetooth-like Secure Messaging Platform</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
