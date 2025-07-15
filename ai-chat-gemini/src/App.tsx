import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <div className="app">
        <h1>Gemini AI Chatbot</h1>
        <ChatWindow />
        <ChatInput />
      </div>
    </ChatProvider>
  );
};

export default App;
