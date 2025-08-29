import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Send, Minimize2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export function FloatingCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Meow Meow Pet Shop. How can I help you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state, removeItem, updateQuantity } = useCart();
  const { items, total, itemCount } = state;

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
        timestamp: new Date()
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
          timestamp: new Date()
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

  const formatPrice = (price: number) => {
    return `৳${price.toFixed(2)}`;
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-row gap-3">
        {/* Messenger Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#26732d] hover:bg-[#1e5d26] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          data-testid="floating-messenger-button"
        >
          <MessageCircle size={24} />
        </button>
        
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="bg-[#26732d] hover:bg-[#1e5d26] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          data-testid="floating-cart-button"
        >
          <ShoppingCart size={24} />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Floating Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-[9999] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 bg-[#26732d] text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Meow Meow Logo" className="w-8 h-8 rounded-full" />
              <div>
                <h3 className="font-bold text-sm">Meow Meow Support</h3>
                <p className="text-xs text-green-200">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-[#1e5d26] p-1 rounded"
              data-testid="close-chat-button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-[#ffde59] text-black rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm px-3 py-2">
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
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 text-sm"
                data-testid="chat-message-input"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="bg-[#ffde59] hover:bg-[#f5d442] text-black px-3"
                data-testid="send-chat-message-button"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-[9999] transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-[#26732d] text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="hover:bg-[#1e5d26] p-1 rounded"
                  data-testid="close-cart-button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <Button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 bg-[#26732d] hover:bg-[#1e5d26]"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3" data-testid={`cart-item-${item.id}`}>
                        <div className="flex items-start gap-3">
                          <img 
                            src={item.image || '/api/placeholder/60/60'} 
                            alt={item.name}
                            className="w-15 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                            <p className="text-[#26732d] font-bold">{formatPrice(item.price)}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                                data-testid={`decrease-quantity-${item.id}`}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                                data-testid={`increase-quantity-${item.id}`}
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 ml-2"
                                data-testid={`remove-item-${item.id}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold text-[#26732d]">{formatPrice(total)}</span>
                  </div>
                  <div className="space-y-2">
                    <Link href="/cart">
                      <Button 
                        className="w-full bg-[#26732d] hover:bg-[#1e5d26]"
                        onClick={() => setIsCartOpen(false)}
                        data-testid="view-cart-button"
                      >
                        View Cart
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#26732d] text-[#26732d] hover:bg-[#26732d] hover:text-white"
                      data-testid="checkout-button"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}