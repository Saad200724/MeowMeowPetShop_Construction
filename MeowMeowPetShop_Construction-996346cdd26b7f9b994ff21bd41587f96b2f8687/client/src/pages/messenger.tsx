import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Smile } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export default function MessengerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Meow Meow Pet Shop. How can I help you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'delivered'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate support response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const supportMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message! Our customer service team will get back to you shortly. Is there anything specific about our pet products I can help you with?',
          sender: 'support',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, supportMessage]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-[#26732d] text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#1e5d26] p-2">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#26732d] font-bold text-lg">M</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">Meow Meow Support</h2>
                <p className="text-sm text-green-200">Online • Usually replies instantly</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#1e5d26] p-2">
              <Phone size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#1e5d26] p-2">
              <Video size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#1e5d26] p-2">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-[#26732d] text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${
                  message.sender === 'user' ? 'text-green-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
                {message.sender === 'user' && message.status && (
                  <span className="text-xs text-green-200">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end gap-1">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 p-2">
            <Smile size={20} />
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="resize-none border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
              data-testid="message-input"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-[#26732d] hover:bg-[#1e5d26] p-3"
            data-testid="send-message-button"
          >
            <Send size={20} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          We typically reply within a few minutes during business hours (9 AM - 9 PM)
        </p>
      </div>
    </div>
  );
}