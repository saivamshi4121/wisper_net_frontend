# WhisperNet Frontend

A modern, blockchain-based messaging application built with React. This frontend provides an intuitive interface for sending secure messages, exploring the blockchain, and synchronizing with the backend server.

## 🚀 Features

### 💬 **Chat Interface**
- **Real-time Messaging**: Send and receive messages instantly
- **Message Verification**: Each message is cryptographically verified
- **User Identification**: Unique user IDs for message attribution
- **Offline Support**: Works without internet connection
- **Local Storage**: Messages persist in browser storage

### 🔗 **Blockchain Explorer**
- **Visual Chain**: See all messages as linked blocks
- **Block Details**: View cryptographic hashes and signatures
- **Integrity Check**: Verify blockchain validity in real-time
- **Statistics**: Track total blocks, senders, and messages
- **Interactive Blocks**: Click blocks to see detailed information

### 📡 **Backend Integration**
- **Server Sync**: Synchronize local blockchain with backend
- **Connection Status**: Real-time server availability monitoring
- **Auto-sync**: Periodic health checks and status updates
- **Error Handling**: Graceful fallback when server is unavailable

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Automatic theme detection
- **Smooth Animations**: Engaging user interactions
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Prerequisites

- **Node.js**: Version 14 or higher
- **npm**: Usually comes with Node.js
- **Backend Server**: WhisperNet backend running on port 3001

## 📦 Installation

1. **Navigate to frontend directory:**
   ```bash
   cd whispernet-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend root directory:

```env
# Backend API URL (default: http://localhost:3001)
REACT_APP_API_URL=http://localhost:3001

# Optional: Custom port for frontend
PORT=3000
```

### Backend Connection

Ensure your WhisperNet backend is running:
```bash
cd ../whispernet-backend
npm run dev
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## 📱 Usage

### Sending Messages
1. Type your message in the chat input
2. Press Enter or click Send
3. Message is automatically added to the blockchain
4. Message appears instantly in the chat

### Exploring the Blockchain
1. Click the "🔗 Blockchain Explorer" tab
2. View all blocks in the chain
3. Click on any block to see detailed information
4. Monitor chain integrity status

### Syncing with Backend
1. Check server connection status in the sidebar
2. Click "Sync to Server" to upload your blockchain
3. View sync results and server statistics
4. Monitor connection health automatically

### Settings
- **Show Block Details**: Toggle cryptographic information in chat
- **Clear Messages**: Remove all local messages (use with caution)

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Message.js          # Individual message display
│   ├── ChatInput.js        # Message composition
│   ├── BlockchainExplorer.js # Blockchain visualization
│   └── SyncStatus.js       # Backend connection status
├── utils/
│   └── blockchain.js       # Blockchain utilities
├── services/
│   └── api.js             # Backend API communication
└── App.js                 # Main application component
```

### State Management
- **Local State**: React hooks for component state
- **Local Storage**: Persistent blockchain data
- **Real-time Updates**: Immediate UI updates on state changes

### Data Flow
1. User types message → ChatInput component
2. Message processed → Blockchain utilities
3. New block created → App state updated
4. UI re-renders → Message appears in chat
5. Data saved → Local storage persistence
6. Optional sync → Backend server communication

## 🔒 Security Features

### Cryptographic Integrity
- **SHA-256 Hashing**: Secure block identification
- **Digital Signatures**: Message authenticity verification
- **Hash Chaining**: Tamper-evident data structure
- **Local Validation**: Client-side integrity checking

### Privacy
- **Local Storage**: Data stays on your device
- **No Central Server**: Decentralized message storage
- **User Anonymity**: Generated user IDs, no personal data

## 🌐 Offline Capabilities

### Local-First Design
- **Works Offline**: No internet required for messaging
- **Local Storage**: Messages persist between sessions
- **Auto-Sync**: Synchronizes when connection restored
- **Graceful Degradation**: Functions without backend

### Data Persistence
- **localStorage**: Automatic message saving
- **User Preferences**: Settings and configurations
- **Blockchain State**: Complete message history

## 📱 Responsive Design

### Device Support
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout and touch support
- **Mobile**: Mobile-first responsive design
- **Touch Devices**: Touch-friendly interactions

### Breakpoints
- **Large**: 1200px+ (desktop)
- **Medium**: 768px-1024px (tablet)
- **Small**: 480px-768px (mobile)
- **Extra Small**: <480px (small mobile)

## 🎨 Customization

### Themes
- **Light Mode**: Default clean interface
- **Dark Mode**: Automatic system preference detection
- **Custom Colors**: Modify CSS variables for branding

### Styling
- **CSS Variables**: Easy color and spacing customization
- **Component CSS**: Modular styling system
- **Responsive Utilities**: Built-in responsive helpers

## 🚨 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend server is running
   - Check port 3001 is available
   - Verify network connectivity

2. **Messages Not Saving**
   - Check browser localStorage support
   - Clear browser cache and try again
   - Verify JavaScript is enabled

3. **UI Not Loading**
   - Check Node.js version compatibility
   - Reinstall dependencies: `npm install`
   - Clear npm cache: `npm cache clean --force`

### Error Messages

- **"Failed to fetch"**: Backend server unavailable
- **"Storage quota exceeded"**: Clear browser data
- **"Invalid blockchain"**: Corrupted local data (auto-fixed)

## 🔮 Future Enhancements

### Planned Features
- **End-to-End Encryption**: Message encryption
- **User Authentication**: Login and user management
- **Message Search**: Find specific messages
- **File Sharing**: Secure file attachments
- **Group Chats**: Multi-user conversations

### Technical Improvements
- **WebRTC**: Peer-to-peer messaging
- **Service Workers**: Offline app capabilities
- **IndexedDB**: Enhanced local storage
- **WebAssembly**: Performance optimizations

## 📞 Support

### Getting Help
1. Check the troubleshooting section
2. Review backend documentation
3. Check browser console for errors
4. Verify all dependencies are installed

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**🔗 WhisperNet Frontend** - Secure, decentralized messaging powered by blockchain technology.
