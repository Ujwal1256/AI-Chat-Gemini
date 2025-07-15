import React from 'react';

interface Props {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const MessageBubble: React.FC<Props> = ({ role, text, timestamp }) => {
  return (
    <div className={`bubble ${role}`}>
      <div className="text">{text}</div>
      <div className="timestamp">{new Date(timestamp).toLocaleTimeString()}</div>
    </div>
  );
};

export default MessageBubble;
