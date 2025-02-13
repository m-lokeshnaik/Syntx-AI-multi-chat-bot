import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD2zjD8TqmDd3DZ06JcXon6455XV3Buq9I');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Store chat history in chrome.storage
let chatHistory = [];

// Load chat history
chrome.storage.local.get(['chatHistory'], (result) => {
  if (result.chatHistory) {
    chatHistory = result.chatHistory;
    displayMessages();
  }
});

function addMessage(content, isUser = false) {
  const message = {
    content,
    isUser,
    timestamp: new Date().toISOString()
  };
  
  chatHistory.push(message);
  chrome.storage.local.set({ chatHistory });
  displayMessages();
}

function displayMessages() {
  chatMessages.innerHTML = '';
  chatHistory.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(message.isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message.content;
    chatMessages.appendChild(messageElement);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateResponse(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

async function handleSend() {
  const message = userInput.value.trim();
  if (!message) return;

  // Disable input while processing
  userInput.disabled = true;
  sendButton.disabled = true;

  // Add user message
  addMessage(message, true);
  userInput.value = '';

  try {
    const response = await generateResponse(message);
    addMessage(response, false);
  } catch (error) {
    console.error('Error:', error);
    addMessage('Sorry, there was an error processing your request.', false);
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});