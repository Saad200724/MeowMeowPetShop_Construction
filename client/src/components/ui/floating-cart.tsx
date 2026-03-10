
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Send, Minimize2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useChat } from '@/contexts/chat-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export function FloatingCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isChatOpen, toggleChat, closeChat } = useChat();
  const [showPlatformSelection, setShowPlatformSelection] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<'messenger' | 'whatsapp' | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Meow Meow Pet Shop!\n\nPhone: 01405-045023\nLocation: Bank Colony, Savar, Dhaka\n\nHow would you like to chat with us?',
      sender: 'support',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state, removeItem, updateQuantity } = useCart();
  const { items, total, itemCount } = state;
  const [location] = useLocation();

  // Hide floating buttons on auth and admin pages
  const shouldHideFloatingButtons = [
    '/sign-in',
    '/sign-up', 
    '/forgot-password',
    '/admin'
  ].some(path => location.startsWith(path));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleToggleChat = () => {
      toggleChat();
    };

    window.addEventListener('toggleChat', handleToggleChat);
    return () => {
      window.removeEventListener('toggleChat', handleToggleChat);
    };
  }, [toggleChat]);

  const handlePlatformSelect = (platform: 'messenger' | 'whatsapp') => {
    setSelectedPlatform(platform);
    setShowPlatformSelection(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // If platform is selected, redirect to the platform
      if (selectedPlatform === 'messenger') {
        // Redirect to Facebook Messenger
        window.open('https://m.me/meow.meow.pet.shop1', '_blank');
        return;
      } else if (selectedPlatform === 'whatsapp') {
        // Redirect to WhatsApp with the message
        const whatsappMessage = encodeURIComponent(`Hello Meow Meow Pet Shop! ${newMessage}`);
        window.open(`https://wa.me/8801838511583?text=${whatsappMessage}`, '_blank');
        return;
      }

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

  // Don't render floating buttons on auth and admin pages
  if (shouldHideFloatingButtons) {
    return null;
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[9999] flex flex-row gap-2">
        {/* Messenger Button */}
        <button
          onClick={toggleChat}
          className="text-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110"
          style={{backgroundColor: '#fec900'}}
          data-testid="floating-messenger-button"
        >
          <MessageCircle size={20} className="md:w-6 md:h-6" />
        </button>
        
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="bg-[#26732d] hover:bg-[#1e5d26] text-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 relative"
          data-testid="floating-cart-button"
        >
          <ShoppingCart size={20} className="md:w-6 md:h-6" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white min-w-[18px] h-4 md:min-w-[20px] md:h-5 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Floating Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 md:right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-[9999] flex flex-col">
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
              onClick={closeChat}
              className="hover:bg-[#1e5d26] p-1 rounded"
              data-testid="close-chat-button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-[#ffde59] text-black rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <span className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Platform Selection Buttons - Show after first message */}
                {index === 0 && showPlatformSelection && (
                  <div className="flex justify-start mt-3">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handlePlatformSelect('messenger')}
                        className="bg-[#0084ff] hover:bg-[#0066cc] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        data-testid="messenger-button"
                      >
                        <MessageCircle size={16} />
                        Messenger
                      </button>
                      <button
                        onClick={() => handlePlatformSelect('whatsapp')}
                        className="bg-[#25d366] hover:bg-[#20b358] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        data-testid="whatsapp-button"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                )}
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

          {/* Input Area - Only show after platform selection */}
          {selectedPlatform && (
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Type a message to send via ${selectedPlatform === 'messenger' ? 'Messenger' : 'WhatsApp'}...`}
                  className="flex-1 text-sm text-gray-900 bg-white"
                  data-testid="chat-message-input"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="text-white px-3"
                  style={{backgroundColor: selectedPlatform === 'whatsapp' ? '#25d366' : '#0084ff'}}
                  data-testid="send-chat-message-button"
                >
                  <Send size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Clicking send will open {selectedPlatform === 'messenger' ? 'Facebook Messenger' : 'WhatsApp'} to continue the conversation.
              </p>
            </div>
          )}
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
          
          {/* Cart Panel - Right-sided for both mobile and desktop */}
          <div className="fixed 
            /* Mobile: Right-sided panel */
            top-0 right-0 bottom-0
            w-[85vw] max-w-sm rounded-l-2xl
            /* Desktop: Large right sidebar style */
            md:top-0 md:right-0 md:bottom-0 md:w-[450px] md:max-w-[450px] md:h-full md:rounded-none
            lg:w-[500px] lg:max-w-[500px]
            bg-white shadow-2xl z-[9999] transform transition-transform duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b bg-[#26732d] text-white flex-shrink-0 rounded-tl-2xl md:rounded-none">
              <h2 className="text-lg font-bold flex items-center gap-2">
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
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center">
                  <div className="bg-gray-100 p-4 md:p-6 rounded-full mb-4">
                    <ShoppingCart size={40} className="md:w-12 md:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6 text-sm md:text-base">Looks like you haven't added any items to your cart yet.</p>
                  <Button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#26732d] hover:bg-[#1e5d26] text-white px-6 py-2"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-3 md:p-6 space-y-3 md:space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm" data-testid={`cart-item-${item.id}`}>
                      <div className="flex gap-4 md:gap-6">
                        {/* Product Image - Larger on desktop */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-lg overflow-hidden border">
                            <img 
                              src={item.image || '/api/placeholder/96/96'} 
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm md:text-base leading-tight line-clamp-2 mb-2 md:mb-3">
                            {item.name}
                          </h4>
                          <p className="text-[#26732d] font-bold text-sm md:text-lg mb-3 md:mb-4">
                            {formatPrice(item.price)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 md:p-2 transition-colors text-black"
                                data-testid={`decrease-quantity-${item.id}`}
                              >
                                <Minus size={14} className="md:w-4 md:h-4 text-black" />
                              </button>
                              <span className="w-8 md:w-12 text-center text-sm md:text-base font-medium text-black">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 md:p-2 transition-colors text-black"
                                data-testid={`increase-quantity-${item.id}`}
                              >
                                <Plus size={14} className="md:w-4 md:h-4 text-black" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-1 md:p-2 ml-2 transition-colors"
                              data-testid={`remove-item-${item.id}`}
                            >
                              <Trash2 size={14} className="md:w-4 md:h-4" />
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
              <div className="border-t bg-gray-50 p-3 md:p-6 flex-shrink-0">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <span className="text-lg md:text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-xl md:text-2xl font-bold text-[#26732d]">{formatPrice(total)}</span>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <Link href="/cart">
                    <Button 
                      className="w-full bg-[#26732d] hover:bg-[#1e5d26] text-white md:py-3 md:text-lg"
                      onClick={() => setIsCartOpen(false)}
                      data-testid="view-cart-button"
                    >
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout">
                    <Button 
                      variant="outline" 
                      className="w-full border-[#26732d] text-[#26732d] hover:bg-[#26732d] hover:text-white md:py-3 md:text-lg"
                      onClick={() => setIsCartOpen(false)}
                      data-testid="checkout-button"
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
