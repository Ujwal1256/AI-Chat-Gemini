import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';

const ChatWindow: React.FC = () => {
  const { messages, error, loading } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          role={msg.role}
          text={msg.text}
          timestamp={msg.timestamp}
        />
      ))}

      {/* Show loading message */}
      {loading && (
        <div className="bubble assistant">
          <em>Thinking...</em>
        </div>
      )}

      {/* Show error message */}
      {error && (
        <div className="bubble assistant" style={{ backgroundColor: '#ffcdd2', color: '#b71c1c' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
