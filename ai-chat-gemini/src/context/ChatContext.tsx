import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_KEY } from '../constants/gemainiAPI';

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  sendMessage: (text: string) => Promise<void>;
  loading: boolean;
  error: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem('chatMessages');
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text }] }
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Unknown error');
      }

      const data = await res.json();
      const assistantReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      addMessage({ role: 'assistant', text: assistantReply, timestamp: new Date().toISOString() });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, sendMessage, loading, error }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};