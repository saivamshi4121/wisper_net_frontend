import React, { useState, useEffect } from 'react';
import './PeerDiscovery.css';

// Simulated Bluetooth devices for demo - moved outside component to prevent recreation
const demoDevices = [
    {
        id: 'demo_phone_1',
        deviceName: 'iPhone 15 Pro',
        location: 'Demo Mode - Bluetooth Range',
        connectedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'discovered',
        isDemo: true
    },
    {
        id: 'demo_laptop_1',
        deviceName: 'MacBook Air',
        location: 'Demo Mode - Bluetooth Range',
        connectedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'discovered',
        isDemo: true
    },
    {
        id: 'demo_android_1',
        deviceName: 'Samsung Galaxy S24',
        location: 'Demo Mode - Bluetooth Range',
        connectedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'discovered',
        isDemo: true
    }
];

const PeerDiscovery = ({ currentPeerId, onPeerSelect, onPeerConnect }) => {
    const [peers, setPeers] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState(null);
    const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
    const [bluetoothError, setBluetoothError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [demoMode, setDemoMode] = useState(false);

    // Check if Web Bluetooth is available
    useEffect(() => {
        if ('bluetooth' in navigator) {
            setBluetoothAvailable(true);
            setDebugInfo('Web Bluetooth API is available');
        } else {
            setBluetoothError('Web Bluetooth not supported in this browser');
            setDebugInfo('Try using Chrome, Edge, or Opera');
        }
    }, []);

    // Monitor peers state changes for debugging
    useEffect(() => {
        console.log('Peers state changed:', peers);
        console.log('Demo mode state:', demoMode);
    }, [peers, demoMode]);

    // Start scanning for real Bluetooth devices
    const startScanning = async () => {
        if (!bluetoothAvailable) {
            setBluetoothError('Bluetooth not available');
            return;
        }

        setIsScanning(true);
        setBluetoothError('');
        setDebugInfo('Starting Bluetooth scan...');

        try {
            // First, try to get available Bluetooth adapters
            if ('bluetooth' in navigator && 'getAvailability' in navigator.bluetooth) {
                const available = await navigator.bluetooth.getAvailability();
                setDebugInfo(`Bluetooth adapter available: ${available}`);
                
                if (!available) {
                    // Switch to demo mode if Bluetooth not available
                    setDemoMode(true);
                    setBluetoothError('Bluetooth adapter not available - Switching to Demo Mode');
                    setDebugInfo('Demo Mode: Simulating Bluetooth device discovery for demonstration purposes');
                    
                    // Simulate finding demo devices
                    setTimeout(() => {
                        setPeers(demoDevices);
                        setDebugInfo(`Demo Mode: Found ${demoDevices.length} simulated Bluetooth devices`);
                    }, 2000);
                    
                    setIsScanning(false);
                    return;
                }
            }

            // Request Bluetooth device with more permissive settings
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true, // Accept any Bluetooth device
                optionalServices: ['generic_access', 'generic_attribute', 'device_information'],
                // Add filters for common device types
                filters: [
                    { services: ['generic_access'] },
                    { services: ['generic_attribute'] },
                    { services: ['device_information'] },
                    { namePrefix: '' }, // Accept any name
                    { name: '' }, // Accept any name
                ]
            });

            setDebugInfo(`Device found: ${device.name || 'Unknown'} (${device.id})`);

            // Add the discovered device to peers list
            const newPeer = {
                id: device.id || `bt_${Date.now()}`,
                deviceName: device.name || 'Unknown Bluetooth Device',
                location: 'Bluetooth Range',
                connectedAt: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                status: 'discovered',
                bluetoothDevice: device
            };

            setPeers(prevPeers => {
                // Check if device already exists
                const exists = prevPeers.find(p => p.id === newPeer.id);
                if (!exists) {
                    return [...prevPeers, newPeer];
                }
                return prevPeers;
            });

            console.log('Bluetooth device discovered:', device.name);
            setDebugInfo(`Successfully added device: ${device.name}`);
        } catch (error) {
            console.error('Bluetooth scanning error:', error);
            
            if (error.name === 'NotFoundError') {
                setBluetoothError('No Bluetooth devices found in range');
                setDebugInfo('Make sure nearby devices have Bluetooth enabled and are discoverable');
            } else if (error.name === 'NotAllowedError') {
                setBluetoothError('Bluetooth permission denied');
                setDebugInfo('Please allow Bluetooth access when prompted');
            } else if (error.name === 'NotSupportedError') {
                setBluetoothError('Bluetooth not supported on this device');
                setDebugInfo('This device may not have Bluetooth capability');
            } else if (error.name === 'SecurityError') {
                setBluetoothError('Bluetooth access blocked by security policy');
                setDebugInfo('Try using HTTPS or localhost');
            } else {
                setBluetoothError(`Bluetooth error: ${error.message}`);
                setDebugInfo(`Error details: ${error.name} - ${error.message}`);
            }
        } finally {
            setIsScanning(false);
        }
    };

    // Stop scanning for Bluetooth devices
    const stopScanning = () => {
        setIsScanning(false);
        setDebugInfo('Scan stopped');
    };

    // Connect to a Bluetooth peer
    const connectToPeer = async (peer) => {
        if (peer.isDemo) {
            // Handle demo device connection
            setDebugInfo(`Demo Mode: Connecting to ${peer.deviceName}...`);
            
            setTimeout(() => {
                const updatedPeer = { ...peer, status: 'connected' };
                setSelectedPeer(updatedPeer);
                onPeerSelect(updatedPeer);
                onPeerConnect(updatedPeer);

                // Update peers list
                setPeers(prevPeers => 
                    prevPeers.map(p => 
                        p.id === peer.id ? updatedPeer : p
                    )
                );

                setBluetoothError('');
                setDebugInfo(`Demo Mode: Successfully connected to ${peer.deviceName}`);
            }, 1500);
            
            return;
        }

        if (!peer.bluetoothDevice) {
            setBluetoothError('No Bluetooth device to connect to');
            return;
        }

        try {
            setDebugInfo(`Attempting to connect to ${peer.deviceName}...`);
            
            // Connect to the Bluetooth device
            await peer.bluetoothDevice.gatt.connect();
            console.log('Connected to Bluetooth device:', peer.deviceName);

            // Update peer status
            const updatedPeer = { ...peer, status: 'connected' };
            setSelectedPeer(updatedPeer);
            onPeerSelect(updatedPeer);
            onPeerConnect(updatedPeer);

            // Update peers list
            setPeers(prevPeers => 
                prevPeers.map(p => 
                    p.id === peer.id ? updatedPeer : p
                )
            );

            setBluetoothError('');
            setDebugInfo(`Successfully connected to ${peer.deviceName}`);
        } catch (error) {
            setBluetoothError(`Failed to connect: ${error.message}`);
            setDebugInfo(`Connection error: ${error.name} - ${error.message}`);
            console.error('Bluetooth connection error:', error);
        }
    };

    // Disconnect from a Bluetooth peer
    const disconnectFromPeer = async (peer) => {
        if (peer.isDemo) {
            // Handle demo device disconnection
            const updatedPeer = { ...peer, status: 'discovered' };
            setSelectedPeer(null);
            onPeerSelect(null);

            // Update peers list
            setPeers(prevPeers => 
                prevPeers.map(p => 
                    p.id === peer.id ? updatedPeer : p
                )
            );

            setDebugInfo(`Demo Mode: Disconnected from ${peer.deviceName}`);
            return;
        }

        try {
            if (peer.bluetoothDevice && peer.bluetoothDevice.gatt.connected) {
                await peer.bluetoothDevice.gatt.disconnect();
                console.log('Disconnected from Bluetooth device:', peer.deviceName);
            }

            const updatedPeer = { ...peer, status: 'discovered' };
            setSelectedPeer(null);
            onPeerSelect(null);

            // Update peers list
            setPeers(prevPeers => 
                prevPeers.map(p => 
                    p.id === peer.id ? updatedPeer : p
                )
            );

            setDebugInfo(`Disconnected from ${peer.deviceName}`);
        } catch (error) {
            console.error('Bluetooth disconnection error:', error);
            setDebugInfo(`Disconnect error: ${error.message}`);
        }
    };

    // Test Bluetooth availability
    const testBluetooth = async () => {
        try {
            setDebugInfo('Testing Bluetooth availability...');
            
            if ('bluetooth' in navigator && 'getAvailability' in navigator.bluetooth) {
                const available = await navigator.bluetooth.getAvailability();
                setDebugInfo(`Bluetooth test result: ${available ? 'Available' : 'Not available'}`);
                
                if (!available) {
                    setDemoMode(true);
                    setDebugInfo('Bluetooth not available - Demo Mode enabled for demonstration');
                }
            } else {
                setDebugInfo('Bluetooth availability check not supported');
            }
        } catch (error) {
            setDebugInfo(`Bluetooth test error: ${error.message}`);
        }
    };

    // Enable demo mode manually
    const enableDemoMode = () => {
        console.log('Demo Mode enabled - Setting demo devices:', demoDevices);
        setDemoMode(true);
        setPeers(demoDevices);
        setDebugInfo('Demo Mode enabled: Simulating Bluetooth device discovery for demonstration');
        setBluetoothError('');
        
        // Force a re-render and verify peers are set
        setTimeout(() => {
            console.log('Current peers state after demo mode:', peers);
            console.log('Demo mode state:', demoMode);
        }, 100);
    };

    // Scroll to bottom to show all content
    const scrollToBottom = () => {
        const element = document.querySelector('.peer-discovery');
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Scroll to top
    const scrollToTop = () => {
        const element = document.querySelector('.peer-discovery');
        if (element) {
            element.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="peer-discovery">
            <div className="discovery-header">
                <h3 className="discovery-title">🔵 Bluetooth Discovery</h3>
                <div className="scan-controls">
                    <button 
                        className={`scan-button ${isScanning ? 'scanning' : ''}`}
                        onClick={isScanning ? stopScanning : startScanning}
                        disabled={!bluetoothAvailable}
                    >
                        {isScanning ? '🛑 Stop Scan' : '🔵 Start Bluetooth Scan'}
                    </button>
                    <button 
                        className="test-button"
                        onClick={testBluetooth}
                        disabled={!bluetoothAvailable}
                    >
                        🧪 Test Bluetooth
                    </button>
                    <button 
                        className="demo-button"
                        onClick={enableDemoMode}
                    >
                        🎭 Demo Mode
                    </button>
                </div>
            </div>

            {/* Scroll Navigation */}
            <div className="scroll-navigation">
                <button className="scroll-btn scroll-top" onClick={scrollToTop} title="Scroll to Top">
                    ⬆️
                </button>
                <button className="scroll-btn scroll-bottom" onClick={scrollToBottom} title="Scroll to Bottom">
                    ⬇️
                </button>
            </div>

            {demoMode && (
                <div className="demo-mode-notice">
                    <div className="demo-icon">🎭</div>
                    <h4>Demo Mode Active</h4>
                    <p>Simulating Bluetooth device discovery for demonstration purposes</p>
                    <small>This shows how the real Bluetooth integration would work</small>
                </div>
            )}

            {!bluetoothAvailable && (
                <div className="bluetooth-error">
                    <div className="error-icon">⚠️</div>
                    <p>Web Bluetooth not supported in this browser</p>
                    <small>Try using Chrome, Edge, or Opera</small>
                </div>
            )}

            {bluetoothError && (
                <div className="bluetooth-error">
                    <div className="error-icon">⚠️</div>
                    <p>{bluetoothError}</p>
                </div>
            )}

            {/* Debug Information */}
            <div className="debug-info">
                <h4>🔍 Debug Information</h4>
                <p>{debugInfo || 'No debug info available'}</p>
                
                {/* Debug State Info */}
                <div className="debug-state-info">
                    <h5>🔧 Current State:</h5>
                    <ul>
                        <li>Demo Mode: {demoMode ? '✅ Active' : '❌ Inactive'}</li>
                        <li>Peers Count: {peers.length}</li>
                        <li>Peers Data: {JSON.stringify(peers.map(p => ({ id: p.id, name: p.deviceName, isDemo: p.isDemo })))}</li>
                    </ul>
                </div>
                
                <div className="debug-tips">
                    <h5>💡 Troubleshooting Tips:</h5>
                    <ul>
                        <li>Make sure your phone's Bluetooth is ON and VISIBLE</li>
                        <li>Enable "Pairing mode" or "Discoverable" on your phone</li>
                        <li>Keep devices within 10 meters (30 feet)</li>
                        <li>Use Chrome/Edge browser (Firefox doesn't support Web Bluetooth)</li>
                        <li>Allow Bluetooth permissions when prompted</li>
                        <li>Click "Demo Mode" to simulate Bluetooth functionality</li>
                    </ul>
                </div>
            </div>

            <div className="discovery-status">
                <div className="status-indicator">
                    <span className={`status-dot ${isScanning ? 'scanning' : 'idle'}`}></span>
                    <span className="status-text">
                        {isScanning ? 'Scanning for Bluetooth devices...' : 'Scan stopped'}
                    </span>
                </div>
                <div className="peer-count">
                    Found: {peers.length} Bluetooth device{peers.length !== 1 ? 's' : ''}
                    {demoMode && ' (Demo Mode)'}
                </div>
            </div>

            <div className="peers-list">
                {peers.length === 0 ? (
                    <div className="no-peers">
                        <div className="no-peers-icon">🔵</div>
                        <p>No Bluetooth devices found</p>
                        <small>
                            {demoMode 
                                ? 'Click "Demo Mode" to simulate device discovery'
                                : 'Make sure Bluetooth is enabled and devices are discoverable'
                            }
                        </small>
                    </div>
                ) : (
                    peers.map((peer) => (
                        <div 
                            key={peer.id} 
                            className={`peer-item ${selectedPeer?.id === peer.id ? 'selected' : ''} ${peer.isDemo ? 'demo-peer' : ''}`}
                            onClick={() => setSelectedPeer(peer)}
                        >
                            <div className="peer-info">
                                <div className={`peer-avatar ${peer.isDemo ? 'demo' : 'bluetooth'}`}>
                                    {peer.isDemo ? '🎭' : '🔵'}
                                </div>
                                <div className="peer-details">
                                    <div className="peer-name">
                                        {peer.deviceName}
                                        {peer.isDemo && <span className="demo-badge">Demo</span>}
                                    </div>
                                    <div className="peer-id">{peer.id}</div>
                                    <div className="peer-location">{peer.location}</div>
                                </div>
                            </div>
                            
                            <div className="peer-status">
                                <span className={`status-badge ${peer.status}`}>
                                    {peer.status}
                                </span>
                                <div className="peer-actions">
                                    {selectedPeer?.id === peer.id ? (
                                        <button 
                                            className="disconnect-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                disconnectFromPeer(peer);
                                            }}
                                        >
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button 
                                            className="connect-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                connectToPeer(peer);
                                            }}
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedPeer && (
                <div className="selected-peer-info">
                    <h4>Connected to: {selectedPeer.deviceName}</h4>
                    {selectedPeer.isDemo && (
                        <div className="demo-notice">
                            <span>🎭 Demo Mode - Simulated Connection</span>
                        </div>
                    )}
                    <div className="peer-stats">
                        <div className="stat">
                            <span className="stat-label">Device ID:</span>
                            <span className="stat-value">{selectedPeer.id}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Connection:</span>
                            <span className="stat-value">{selectedPeer.status}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Type:</span>
                            <span className="stat-value">
                                {selectedPeer.isDemo ? 'Demo Device' : 'Bluetooth Device'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll Help Message */}
            {demoMode && peers.length > 0 && (
                <div className="scroll-help">
                    <div className="scroll-help-icon">💡</div>
                    <p>Use the scroll buttons on the right to navigate through all the information!</p>
                    <small>Scroll up to see the demo devices and connect to them</small>
                </div>
            )}
        </div>
    );
};

export default PeerDiscovery;

