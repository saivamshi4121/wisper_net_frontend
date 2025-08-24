// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get full API URL
const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

// API Functions
export const getBlockchainFromServer = async () => {
    try {
        const response = await fetch(getApiUrl('/blockchain'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.blockchain || [];
    } catch (error) {
        console.error('Error fetching blockchain:', error);
        return [];
    }
};

export const syncBlockchainToServer = async (blockchain, peerId = null) => {
    try {
        const response = await fetch(getApiUrl('/sync'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blockchain, peerId }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error syncing blockchain:', error);
        throw error;
    }
};

export const connectAsPeer = async (peerId) => {
    try {
        const response = await fetch(getApiUrl('/peer/connect'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ peerId }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error connecting as peer:', error);
        throw error;
    }
};

export const getConnectedPeers = async () => {
    try {
        const response = await fetch(getApiUrl('/peers'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.peers || [];
    } catch (error) {
        console.error('Error fetching peers:', error);
        return [];
    }
};

export const sendMessageToPeer = async (peerId, message) => {
    try {
        const response = await fetch(getApiUrl('/peer/message'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ peerId, message }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error sending message to peer:', error);
        throw error;
    }
};

export const sendBroadcastMessage = async (message) => {
    try {
        const response = await fetch(getApiUrl('/peer/broadcast'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error broadcasting message:', error);
        throw error;
    }
};

export const getPeerMessages = async (peerId) => {
    try {
        const response = await fetch(getApiUrl(`/peer/messages/${peerId}`));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.messages || [];
    } catch (error) {
        console.error('Error fetching peer messages:', error);
        return [];
    }
};

export const disconnectPeer = async (peerId) => {
    try {
        const response = await fetch(getApiUrl('/peer/disconnect'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ peerId }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error disconnecting peer:', error);
        throw error;
    }
};

// Environment detection
export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

// API status check
export const checkApiHealth = async () => {
    try {
        const response = await fetch(getApiUrl('/'));
        return response.ok;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
};



