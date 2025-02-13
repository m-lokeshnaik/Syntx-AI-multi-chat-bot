import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageSquare, PenLine, Languages, FileSearch, DramaIcon as GrammarIcon, HelpCircle, Search, PenTool as Tool, Send, Link2, Clock, Plus, Settings } from 'lucide-react';
import type { Message, AIModel, ModelConfig } from './types';

const MODELS: ModelConfig[] = [
  {
    id: 'gemini',
    name: 'Gemini 2.0 Pro',
    icon: '🌀',
    category: 'Basic',
    apiKey: 'AIzaSyD2zjD8TqmDd3DZ06JcXon6455XV3Buq9I'
  },
  {
    id: 'gpt',
    name: 'GPT-4o mini',
    icon: '💠',
    category: 'Basic',
    apiKey: ''
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Haiku',
    icon: '⚪',
    category: 'Basic',
    apiKey: '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'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3',
    icon: '🔵',
    category: 'Advanced',
    apiKey: 'sk-59d0561645974aedb7a4a33c7b016b58'
  }
];

const SIDEBAR_ITEMS = [
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Chat', active: true },
  { icon: <PenLine className="w-5 h-5" />, label: 'Write' },
  { icon: <Languages className="w-5 h-5" />, label: 'Translate' },
  { icon: <FileSearch className="w-5 h-5" />, label: 'OCR' },
  { icon: <GrammarIcon className="w-5 h-5" />, label: 'Grammar' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Ask' },
  { icon: <Search className="w-5 h-5" />, label: 'Search' },
  { icon: <Tool className="w-5 h-5" />, label: 'Tools' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>('deepseek');
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [currentPage, setCurrentPage] = useState('Chat');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{
        content: "Hello! How can I assist you today? 😊",
        isUser: false,
        timestamp: new Date().toISOString(),
        model: currentModel
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  async function generateGeminiResponse(prompt: string) {
    try {
      const model = MODELS.find(m => m.id === 'gemini');
      if (!model?.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const genAI = new GoogleGenerativeAI(model.apiKey);
      const genModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await genModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate response from Gemini');
    }
  }

  async function generateDeepseekResponse(prompt: string) {
    try {
      const model = MODELS.find(m => m.id === 'deepseek');
      if (!model?.apiKey) {
        throw new Error('Deepseek API key not configured');
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate response from Deepseek');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Deepseek API error:', error);
      throw new Error('Failed to generate response from Deepseek');
    }
  }

  async function generateClaudeResponse(prompt: string) {
    try {
      const model = MODELS.find(m => m.id === 'claude');
      if (!model?.apiKey) {
        throw new Error('Claude API key not configured');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': model.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate response from Claude');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate response from Claude');
    }
  }

  async function generateResponse(prompt: string) {
    const model = MODELS.find(m => m.id === currentModel);
    if (!model?.apiKey) {
      throw new Error(`${model?.name} API key not configured`);
    }

    switch (currentModel) {
      case 'gemini':
        return await generateGeminiResponse(prompt);
      case 'deepseek':
        return await generateDeepseekResponse(prompt);
      case 'claude':
        return await generateClaudeResponse(prompt);
      default:
        throw new Error('Selected model is not implemented yet');
    }
  }

  async function handleSend() {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      content: input.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
      model: currentModel
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await generateResponse(input);
      const botMessage: Message = {
        content: response,
        isUser: false,
        timestamp: new Date().toISOString(),
        model: currentModel
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      const errorBotMessage: Message = {
        content: `Error: ${errorMessage}. Please try again or switch to a different model.`,
        isUser: false,
        timestamp: new Date().toISOString(),
        model: currentModel
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0F1115] text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A1B1E] border-r border-gray-800">
        <div className="p-4 flex items-center gap-2">
          <div className="text-2xl">🌈</div>
          <h1 className="text-xl font-semibold">Sider</h1>
        </div>
        
        <nav className="px-2 py-4">
          {SIDEBAR_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors ${
                currentPage === item.label ? 'bg-gray-800 text-gray-100' : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentPage === 'Chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="flex flex-col">
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-blue-400">
                        {MODELS.find(m => m.id === message.model)?.icon}
                      </div>
                      <span className="text-sm text-gray-400">
                        {MODELS.find(m => m.id === message.model)?.name}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.isUser ? 'bg-gray-800' : 'bg-transparent'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800">
              <div className="max-w-4xl mx-auto relative">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setShowModelSelect(!showModelSelect)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <span>{MODELS.find(m => m.id === currentModel)?.icon}</span>
                    <span>{MODELS.find(m => m.id === currentModel)?.name}</span>
                  </button>
                  <Link2 className="w-4 h-4 text-gray-500" />
                  <div className="flex-1" />
                  <Clock className="w-4 h-4 text-gray-500" />
                  <Plus className="w-4 h-4 text-gray-500" />
                </div>

                {showModelSelect && (
                  <div className="absolute bottom-full mb-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 z-50">
                    <div className="space-y-2">
                      <div>
                        <div className="mb-2 px-2 py-1 text-sm text-gray-400">Basic</div>
                        {MODELS.filter(m => m.category === 'Basic').map(model => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setCurrentModel(model.id);
                              setShowModelSelect(false);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                              currentModel === model.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                          >
                            <span>{model.icon}</span>
                            <span>{model.name}</span>
                          </button>
                        ))}
                      </div>
                      <div>
                        <div className="mb-2 px-2 py-1 text-sm text-gray-400">Advanced</div>
                        {MODELS.filter(m => m.category === 'Advanced').map(model => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setCurrentModel(model.id);
                              setShowModelSelect(false);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                              currentModel === model.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                          >
                            <span>{model.icon}</span>
                            <span>{model.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:border-gray-600"
                    rows={1}
                    style={{ minHeight: '44px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : currentPage === 'Tools' ? (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Tools</h2>
            <div className="grid grid-cols-3 gap-4">
              {['ChatPDF', 'YouTube Summarizer', 'AI Video Shortener', 'AI Essay Writer', 'AI Translator', 'Image Translator', 'PDF Translator'].map((tool) => (
                <div key={tool} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <h3 className="font-medium">{tool}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-xl text-gray-400">Coming Soon</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;