import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, Clock, ShoppingBag, Sparkles, Star, DollarSign, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const AIShopper = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hi! I'm your AI Personal Shopping Assistant. I can help you find the best deals, compare products, and track prices. What are you looking for today?",
      timestamp: new Date()
    }
  ]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { products, watchlist, searchQuery, recommendations, cartItems } = useAppContext();
  const { user } = useAuth();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response
  const generateAIResponse = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    // Product statistics
    const totalProducts = products.length;
    const inStockCount = products.filter(p => p.status === 'In Stock').length;
    const onSaleCount = products.filter(p => p.originalPrice && p.currentPrice < p.originalPrice).length;
    
    // Find best deals
    const deals = products
      .filter(p => p.originalPrice && p.currentPrice < p.originalPrice)
      .map(p => ({
        ...p,
        discount: ((p.originalPrice - p.currentPrice) / p.originalPrice * 100).toFixed(0)
      }))
      .sort((a, b) => b.discount - a.discount);
    
    const bestDeal = deals[0];
    
    // Categories
    const categories = [...new Set(products.map(p => p.category))];
    
    // Response logic
    if (query.includes('trending') || query.includes('popular') || query.includes('hot')) {
      return {
        text: `🔥 **Today's Trending Products**\n\n` +
              products.slice(0, 5).map((p, i) => 
                `${i+1}. **${p.name}** - $${p.currentPrice?.toFixed(2)} (${p.category})`
              ).join('\n') +
              `\n\n✨ Most active category: **${categories[0]}**`,
        suggestions: ['Show deals', 'Compare top 2', 'Add to watchlist']
      };
    }
    
    else if (query.includes('deal') || query.includes('sale') || query.includes('discount')) {
      if (deals.length > 0) {
        return {
          text: `💰 **Best Deals Right Now**\n\n` +
                deals.slice(0, 3).map((p, i) => 
                  `${i+1}. **${p.name}**\n` +
                  `   • Was: $${p.originalPrice?.toFixed(2)}\n` +
                  `   • Now: $${p.currentPrice.toFixed(2)}\n` +
                  `   • Save ${p.discount}% at ${p.store}`
                ).join('\n\n') +
                `\n\n📊 Total ${deals.length} products on sale`,
          suggestions: ['Show all deals', 'Best discount', 'Price history']
        };
      }
    }
    
    else if (query.includes('watchlist') || query.includes('saved')) {
      if (watchlist.length > 0) {
        return {
          text: `👀 **Your Watchlist (${watchlist.length} items)**\n\n` +
                watchlist.slice(0, 5).map((item, i) => 
                  `${i+1}. **${item.name}** - $${item.currentPrice?.toFixed(2)} at ${item.store}`
                ).join('\n') +
                `\n\n💡 **Tip:** ${watchlist.some(i => i.originalPrice) ? 'Some items are on sale!' : 'Track more items for price alerts'}`,
          suggestions: ['Check price drops', 'Remove items', 'Compare']
        };
      }
    }
    
    else if (query.includes('compare') || query.includes('vs') || query.includes('versus')) {
      // Extract product names from query
      const productList = products.map(p => p.name.toLowerCase());
      const mentioned = productList.filter(name => query.includes(name));
      
      if (mentioned.length >= 2) {
        const compareItems = products.filter(p => mentioned.includes(p.name.toLowerCase()));
        return {
          text: `📊 **Product Comparison**\n\n` +
                compareItems.map(p => 
                  `**${p.name}**\n` +
                  `• Price: $${p.currentPrice?.toFixed(2)}\n` +
                  `• Store: ${p.store}\n` +
                  `• Status: ${p.status}`
                ).join('\n\n'),
          suggestions: ['Which is better?', 'Check reviews', 'Price difference']
        };
      }
    }
    
    else if (query.includes('category') || query.includes('categories')) {
      return {
        text: `📁 **Available Categories**\n\n` +
              categories.map((cat, i) => 
                `${i+1}. **${cat}** (${products.filter(p => p.category === cat).length} products)`
              ).join('\n'),
        suggestions: ['Show Electronics', 'Show Audio', 'Best in each']
      };
    }
    
    else if (query.includes('stock') || query.includes('available')) {
      return {
        text: `📦 **Stock Status**\n\n` +
              `• In Stock: ${inStockCount} products\n` +
              `• Low Stock: ${products.filter(p => p.status === 'Low Stock').length} products\n` +
              `• Out of Stock: ${products.filter(p => p.status === 'Out of Stock').length} products`,
        suggestions: ['Show in stock', 'Low stock alerts', 'Restock soon?']
      };
    }
    
    else if (query.includes('price') || query.includes('budget')) {
      const prices = products.map(p => p.currentPrice).filter(p => p);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      
      return {
        text: `💰 **Price Insights**\n\n` +
              `• Average price: $${avgPrice.toFixed(2)}\n` +
              `• Price range: $${Math.min(...prices).toFixed(2)} - $${Math.max(...prices).toFixed(2)}\n` +
              `• ${onSaleCount} items on sale`,
        suggestions: ['Budget picks', 'Premium items', 'Price drops']
      };
    }
    
    else if (query.includes('help') || query.includes('what can you do')) {
      return {
        text: `🤖 **I can help you with:**\n\n` +
              `• Finding trending products\n` +
              `• Comparing items side-by-side\n` +
              `• Tracking price drops\n` +
              `• Managing your watchlist\n` +
              `• Personalized recommendations\n` +
              `• Stock alerts and updates\n\n` +
              `Just ask me anything about products!`,
        suggestions: ['Show trending', 'Best deals', 'My watchlist']
      };
    }
    
    else {
      return {
        text: `I understand you're asking about "${userQuery}". To help you better, try asking about:\n\n` +
              `• "What's trending today?"\n` +
              `• "Show me the best deals"\n` +
              `• "Compare Sony vs Bose"\n` +
              `• "What's in my watchlist?"\n` +
              `• "Which products are in stock?"`,
        suggestions: ['Trending', 'Best deals', 'Compare', 'Watchlist', 'Categories']
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: query,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Show typing
      setIsTyping(true);
      
      // Simulate AI response
      setTimeout(() => {
        const response = generateAIResponse(query);
        
        const aiMessage = {
          id: messages.length + 2,
          type: 'ai',
          text: response.text,
          suggestions: response.suggestions,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
      
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setTimeout(() => handleSubmit(new Event('submit')), 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI Personal Shopper
        </h1>
        <p className="text-gray-500">Your intelligent shopping assistant powered by real-time data</p>
      </div>

      {/* Main Chat Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Stats Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-600">
              <ShoppingBag className="w-4 h-4" />
              {products.length} Products
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              {watchlist.length} Tracked
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <DollarSign className="w-4 h-4" />
              {cartItems.length} In Cart
            </span>
          </div>
          {user && (
            <span className="text-indigo-600 font-medium">
              Hi, {user.name || user.username}!
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.type === 'ai' ? (
                    <>
                      <Bot className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-600">AI Assistant</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-medium text-white/80">You</span>
                    </>
                  )}
                  <span className={`text-xs ml-auto ${message.type === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                          message.type === 'user'
                            ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {suggestion}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about products, prices, or deals..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleSuggestionClick("What's trending today?")}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              🔥 Trending
            </button>
            <button
              onClick={() => handleSuggestionClick("Show me best deals")}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              💰 Best Deals
            </button>
            <button
              onClick={() => handleSuggestionClick("Compare products")}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              🔍 Compare
            </button>
            <button
              onClick={() => handleSuggestionClick("My watchlist")}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              👀 Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIShopper;