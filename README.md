# Syntx-AI-multi-chat-bot

A Chrome extension that provides an AI-powered chat assistant in a side panel, powered by Google's Gemini AI. This extension allows users to have natural conversations with an AI assistant while browsing the web.

## Features

- 🤖 Powered by Google's Gemini AI
- 💬 Clean and intuitive chat interface
- 💾 Persistent chat history using Chrome's storage API
- 🎨 Modern and responsive design
- ⌨️ Support for both click and Enter key to send messages
- 🔄 Real-time message updates
- 📱 Responsive design that works on all screen sizes
- 🔒 Secure API key handling
- 💾 Local storage for chat persistence
- 🎯 Easy-to-use interface

## Tech Stack

### Frontend
- React 18.2.0
- TypeScript 5.2.2
- TailwindCSS 3.4.1
- Lucide React 0.330.0 (for icons)

### Development Tools
- Vite 5.4.2 (Build tool)
- ESLint (Code linting)
- TypeScript ESLint
- PostCSS 8.4.35
- Autoprefixer 10.4.17

### APIs & Services
- Google Generative AI (Gemini)
- Chrome Extension APIs
  - Side Panel API
  - Storage API
  - Service Worker API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Chrome browser (latest version)
- Gemini AI API key
- Git (for version control)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Syntx-AI-multi-chat-bot.git
cd Syntx-AI-multi-chat-bot
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory from the project

## Configuration

1. Get your Gemini AI API key from the Google AI Studio
2. Replace the API key in `sidepanel.js`:
```javascript
const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
```

## Development

To start the development server:

```bash
npm run dev
```

The development server will start with hot-reload enabled, making it easier to see changes in real-time.

## Building for Production

To create a production build:

```bash
npm run build
```

The built extension will be available in the `dist` directory.

## Usage

1. Click the extension icon in your Chrome toolbar to open the side panel
2. Type your message in the input field
3. Press Enter or click the Send button to send your message
4. The AI will respond in the chat interface
5. Your chat history will be saved and persisted between sessions

## Project Structure

```
Syntx-AI-multi-chat-bot/
├── src/                    # Source files
├── dist/                   # Production build
├── background.js           # Chrome extension background script
├── sidepanel.html         # Main chat interface HTML
├── sidepanel.js           # Chat functionality and AI integration
├── styles.css             # Styling for the chat interface
├── manifest.json          # Chrome extension configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Maintain consistent code formatting
- Write meaningful commit messages

### Testing
- Test the extension in different Chrome versions
- Verify chat history persistence
- Check responsive design on various screen sizes
- Ensure proper error handling

### Security
- Never commit API keys
- Use environment variables for sensitive data
- Follow Chrome extension security best practices

## Troubleshooting

Common issues and solutions:

1. **Extension not loading**
   - Ensure Developer mode is enabled
   - Check manifest.json for errors
   - Verify all required files are present

2. **Chat not working**
   - Verify API key is correctly set
   - Check browser console for errors
   - Ensure proper permissions in manifest.json

3. **Chat history not saving**
   - Check Chrome storage permissions
   - Verify storage API implementation
   - Clear browser cache if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Before submitting:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Chrome Extensions API for the side panel functionality
- The React team for the amazing framework
- The Vite team for the fast build tool
- The TailwindCSS team for the utility-first CSS framework

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/Syntx-AI-multi-chat-bot/issues) page
2. Create a new issue if needed
3. Follow the issue template

## Roadmap

Future improvements planned:
- [ ] Add support for multiple AI models
- [ ] Implement conversation export/import
- [ ] Add theme customization
- [ ] Support for markdown in responses
- [ ] Add keyboard shortcuts
- [ ] Implement conversation search
 
