import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Blockchain utility functions for WhisperNet Frontend

// Create a new block
export function createBlock(index, senderId, message, previousHash, recipientId = 'broadcast') {
    const timestamp = new Date().toISOString();
    
    const block = {
        index,
        timestamp,
        senderId,
        message,
        previousHash,
        recipientId,
        signature: '',
        hash: ''
    };

    // Generate signature (for demo purposes, using hash as signature)
    const dataToSign = JSON.stringify({
        index: block.index,
        timestamp: block.timestamp,
        senderId: block.senderId,
        message: block.message,
        previousHash: block.previousHash,
        recipientId: block.recipientId
    });
    
    block.signature = CryptoJS.SHA256(dataToSign).toString();
    
    // Calculate block hash
    block.hash = calculateBlockHash(block);
    
    return block;
}

// Calculate hash for a block
export function calculateBlockHash(block) {
    const blockString = JSON.stringify({
        index: block.index,
        timestamp: block.timestamp,
        senderId: block.senderId,
        message: block.message,
        previousHash: block.previousHash,
        recipientId: block.recipientId,
        signature: block.signature
    });
    
    return CryptoJS.SHA256(blockString).toString();
}

// Create genesis block
export function createGenesisBlock() {
    return createBlock(
        0,
        'genesis',
        'Genesis block - Welcome to WhisperNet',
        '0000000000000000000000000000000000000000000000000000000000000000',
        'broadcast'
    );
}

// Add a new block to the blockchain
export function addBlock(blockchain, senderId, message, recipientId = 'broadcast') {
    const previousBlock = blockchain[blockchain.length - 1];
    const newIndex = previousBlock ? previousBlock.index + 1 : 0;
    const previousHash = previousBlock ? previousBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const newBlock = createBlock(newIndex, senderId, message, previousHash, recipientId);
    return [...blockchain, newBlock];
}

// Verify blockchain integrity
export function verifyBlockchainIntegrity(blockchain) {
    if (!Array.isArray(blockchain) || blockchain.length === 0) {
        return { valid: false, error: 'Empty or invalid blockchain' };
    }

    // Check genesis block
    if (blockchain[0].index !== 0 || blockchain[0].previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return { valid: false, error: 'Invalid genesis block' };
    }

    // Check each block
    for (let i = 0; i < blockchain.length; i++) {
        const block = blockchain[i];
        const previousBlock = i > 0 ? blockchain[i - 1] : null;

        // Validate block structure
        if (!validateBlockStructure(block)) {
            return { valid: false, error: `Block ${i} has invalid structure` };
        }

        // Validate hash linkage
        if (previousBlock && block.previousHash !== previousBlock.hash) {
            return { valid: false, error: `Block ${i} has invalid previous hash` };
        }

        // Validate block hash
        const calculatedHash = calculateBlockHash(block);
        if (block.hash !== calculatedHash) {
            return { valid: false, error: `Block ${i} has invalid hash` };
        }

        // Validate signature
        if (!verifyBlockSignature(block)) {
            return { valid: false, error: `Block ${i} has invalid signature` };
        }
    }

    return { valid: true };
}

// Validate block structure
export function validateBlockStructure(block) {
    const requiredFields = ['index', 'timestamp', 'senderId', 'message', 'previousHash', 'signature', 'hash', 'recipientId'];
    
    for (const field of requiredFields) {
        if (!(field in block) || block[field] === null || block[field] === undefined) {
            return false;
        }
    }

    // Validate types
    if (typeof block.index !== 'number' || block.index < 0) return false;
    if (typeof block.timestamp !== 'string') return false;
    if (typeof block.senderId !== 'string') return false;
    if (typeof block.message !== 'string') return false;
    if (typeof block.previousHash !== 'string') return false;
    if (typeof block.signature !== 'string') return false;
    if (typeof block.hash !== 'string') return false;
    if (typeof block.recipientId !== 'string') return false;

    return true;
}

// Verify block signature
export function verifyBlockSignature(block) {
    try {
        const dataToVerify = JSON.stringify({
            index: block.index,
            timestamp: block.timestamp,
            senderId: block.senderId,
            message: block.message,
            previousHash: block.previousHash,
            recipientId: block.recipientId || 'broadcast'
        });
        
        const expectedSignature = CryptoJS.SHA256(dataToVerify).toString();
        return block.signature === expectedSignature;
    } catch (error) {
        return false;
    }
}

// Get blockchain statistics
export function getBlockchainStats(blockchain) {
    if (!Array.isArray(blockchain) || blockchain.length === 0) {
        return {
            totalBlocks: 0,
            uniqueSenders: 0,
            totalMessages: 0,
            firstBlock: null,
            lastBlock: null
        };
    }

    const uniqueSenders = new Set(blockchain.map(block => block.senderId)).size;
    const totalMessages = blockchain.reduce((sum, block) => sum + block.message.length, 0);

    return {
        totalBlocks: blockchain.length,
        uniqueSenders,
        totalMessages,
        firstBlock: blockchain[0],
        lastBlock: blockchain[blockchain.length - 1],
        averageMessageLength: Math.round(totalMessages / blockchain.length)
    };
}

// Local storage functions
export function saveBlockchainToStorage(blockchain, key = 'whispernet-blockchain') {
    try {
        localStorage.setItem(key, JSON.stringify(blockchain));
        return true;
    } catch (error) {
        console.error('Error saving blockchain to storage:', error);
        return false;
    }
}

export function loadBlockchainFromStorage(key = 'whispernet-blockchain') {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            const blockchain = JSON.parse(data);
            // Validate the loaded blockchain
            const validation = verifyBlockchainIntegrity(blockchain);
            if (validation.valid) {
                return blockchain;
            } else {
                console.warn('Loaded blockchain validation failed, creating new one');
                return [createGenesisBlock()];
            }
        }
        return [createGenesisBlock()];
    } catch (error) {
        console.error('Error loading blockchain from storage:', error);
        return [createGenesisBlock()];
    }
}

// Generate a simple user ID
export function generateUserId() {
    const storedId = localStorage.getItem('whispernet-user-id');
    if (storedId) {
        return storedId;
    }
    
    const newId = `user_${uuidv4().substring(0, 8)}`;
    localStorage.setItem('whispernet-user-id', newId);
    return newId;
}

// Get user display name
export function getUserDisplayName(userId) {
    if (userId === 'genesis') return 'Genesis';
    return userId.replace('user_', 'User ');
}

// Format timestamp for display
export function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString();
    } catch (error) {
        return timestamp;
    }
}



