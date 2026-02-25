import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, TrendingUp, Clock, Star, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AIShopperCard = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "I've analyzed your viewing history. Need help deciding between products or finding the best deals today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { products, watchlist, searchQuery, recommendations } = useAppContext();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response based on user query
  const generateAIResponse = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    // Analyze products data
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.status === 'In Stock').length;
    const onSaleProducts = products.filter(p => p.originalPrice && p.currentPrice < p.originalPrice).length;
    
    // Find most viewed categories (simulated based on search history)
    const categories = [...new Set(products.map(p => p.category))];
    const categoryCounts = categories.map(cat => ({
      category: cat,
      count: products.filter(p => p.category === cat).length
    })).sort((a, b) => b.count - a.count);
    
    const mostPopularCategory = categoryCounts[0]?.category || 'Electronics';
    
    // Find best deals (products with highest discount)
    const productsWithDiscount = products
      .filter(p => p.originalPrice && p.currentPrice < p.originalPrice)
      .map(p => ({
        ...p,
        discount: ((p.originalPrice - p.currentPrice) / p.originalPrice * 100).toFixed(0)
      }))
      .sort((a, b) => b.discount - a.discount);
    
    const bestDeal = productsWithDiscount[0];
    
    // Find products in watchlist
    const watchlistItems = watchlist.length;
    
    // Check if user is searching for something specific
    const currentSearch = searchQuery;

    // Response logic based on query keywords
    if (query.includes('trending') || query.includes('popular') || query.includes('most demanded')) {
      return {
        text: `📈 **Trending Products Today:**\n\n` +
              `Based on current demand, these products are trending:\n\n` +
              products.slice(0, 3).map((p, i) => 
                `${i+1}. **${p.name}** - ${p.category} (${p.status})`
              ).join('\n') +
              `\n\nThe ${mostPopularCategory} category is seeing the most activity right now.`,
        suggestions: ['Show me best deals', 'Compare prices', 'What\'s in my watchlist?']
      };
    }
    
    else if (query.includes('deal') || query.includes('discount') || query.includes('sale') || query.includes('offer')) {
      if (bestDeal) {
        return {
          text: `💰 **Best Deals Today:**\n\n` +
                `🔥 **Top Deal:** ${bestDeal.name}\n` +
                `   • Was: $${bestDeal.originalPrice?.toFixed(2)}\n` +
                `   • Now: $${bestDeal.currentPrice.toFixed(2)}\n` +
                `   • Save: ${bestDeal.discount}% at ${bestDeal.store}\n\n` +
                `Total ${onSaleProducts} products on sale right now!`,
          suggestions: ['Show all deals', 'Compare with similar', 'Add to watchlist']
        };
      } else {
        return {
          text: `No active deals at the moment. Check back soon!`,
          suggestions: ['Show popular products', 'Browse categories']
        };
      }
    }
    
    else if (query.includes('watchlist') || query.includes('saved') || query.includes('tracking')) {
      if (watchlistItems > 0) {
        return {
          text: `👀 **Your Watchlist (${watchlistItems} items):**\n\n` +
                watchlist.slice(0, 3).map((item, i) => 
                  `${i+1}. **${item.name}** - $${item.currentPrice?.toFixed(2)} at ${item.store}`
                ).join('\n') +
                (watchlistItems > 3 ? `\n\n...and ${watchlistItems - 3} more items` : '') +
                `\n\n💡 Tip: ${watchlist.some(i => i.originalPrice) ? 'Some items in your watchlist are on sale!' : 'Add more products to track price drops'}`,
          suggestions: ['View full watchlist', 'Check price drops', 'Compare items']
        };
      } else {
        return {
          text: `Your watchlist is empty. Start adding products to track prices and get alerts!`,
          suggestions: ['Browse products', 'Show recommendations', 'Search for items']
        };
      }
    }
    
    else if (query.includes('compare') || query.includes('vs') || query.includes('versus') || query.includes('between')) {
      // Extract product names for comparison
      const productNames = products.map(p => p.name.toLowerCase());
      const mentionedProducts = productNames.filter(name => query.includes(name));
      
      if (mentionedProducts.length >= 2) {
        const productsToCompare = products.filter(p => 
          mentionedProducts.includes(p.name.toLowerCase())
        );
        
        const comparison = productsToCompare.map(p => 
          `**${p.name}**\n` +
          `   • Price: $${p.currentPrice?.toFixed(2)} ${p.originalPrice ? `(was $${p.originalPrice.toFixed(2)})` : ''}\n` +
          `   • Store: ${p.store}\n` +
          `   • Status: ${p.status}`
        ).join('\n\n');
        
        return {
          text: `🔍 **Product Comparison:**\n\n${comparison}`,
          suggestions: ['Which is better?', 'Check reviews', 'Add to cart']
        };
      } else {
        return {
          text: `I can help you compare products! Try asking like:\n` +
                `• "Compare Sony XM5 vs Bose QC45"\n` +
                `• "Which is better, LG monitor or Samsung?"`,
          suggestions: ['Compare Sony vs Bose', 'Show top picks', 'Price difference']
        };
      }
    }
    
    else if (query.includes('category') || query.includes('type') || query.includes('kind')) {
      return {
        text: `📊 **Available Categories:**\n\n` +
              categories.map((cat, i) => 
                `${i+1}. **${cat}** (${products.filter(p => p.category === cat).length} products)`
              ).join('\n'),
        suggestions: ['Show Electronics', 'Show Audio products', 'Best in each category']
      };
    }
    
    else if (query.includes('stock') || query.includes('available') || query.includes('in stock')) {
      return {
        text: `📦 **Stock Status:**\n\n` +
              `• In Stock: ${products.filter(p => p.status === 'In Stock').length} products\n` +
              `• Low Stock: ${products.filter(p => p.status === 'Low Stock').length} products\n` +
              `• Out of Stock: ${products.filter(p => p.status === 'Out of Stock').length} products`,
        suggestions: ['Show in-stock items', 'Show low stock alerts', 'Restock soon?']
      };
    }
    
    else if (query.includes('recommend') || query.includes('suggest') || query.includes('what should i buy')) {
      const topRated = products.slice(0, 3);
      return {
        text: `🎯 **Personalized Recommendations:**\n\n` +
              `Based on your ${searchQuery ? `interest in "${searchQuery}"` : 'browsing history'}:\n\n` +
              topRated.map((p, i) => 
                `${i+1}. **${p.name}** - $${p.currentPrice?.toFixed(2)} (${p.status})`
              ).join('\n') +
              `\n\nWould you like more specific recommendations?`,
        suggestions: ['Show more', 'Price under $300', 'Best rated']
      };
    }
    
    else if (query.includes('price') || query.includes('cost') || query.includes('expensive') || query.includes('cheap')) {
      const sortedByPrice = [...products].sort((a, b) => a.currentPrice - b.currentPrice);
      const cheapest = sortedByPrice[0];
      const mostExpensive = sortedByPrice[sortedByPrice.length - 1];
      
      return {
        text: `💰 **Price Insights:**\n\n` +
              `• Cheapest: **${cheapest.name}** - $${cheapest.currentPrice?.toFixed(2)}\n` +
              `• Most Expensive: **${mostExpensive.name}** - $${mostExpensive.currentPrice?.toFixed(2)}\n` +
              `• Average Price: $${(products.reduce((sum, p) => sum + p.currentPrice, 0) / products.length).toFixed(2)}`,
        suggestions: ['Show budget options', 'Premium picks', 'Price drops']
      };
    }
    
    else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return {
        text: `👋 Hello! I'm your AI Shopping Assistant. I can help you with:\n` +
              `• Finding trending products\n` +
              `• Comparing items\n` +
              `• Tracking price drops\n` +
              `• Making recommendations\n\n` +
              `What would you like to know?`,
        suggestions: ['What\'s trending?', 'Best deals', 'My watchlist']
      };
    }
    
    else {
      // Default response
      return {
        text: `I understand you're asking about "${userQuery}". To help you better, I can:\n\n` +
              `• Show trending products\n` +
              `• Find the best deals\n` +
              `• Compare products\n` +
              `• Check your watchlist\n\n` +
              `What specific information are you looking for?`,
        suggestions: ['Show trending', 'Best deals', 'Compare products', 'My watchlist']
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
      
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate AI thinking
      setTimeout(() => {
        const response = generateAIResponse(query);
        
        // Add AI response
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
    handleSubmit(new Event('submit'));
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col min-h-[500px]">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">AI Personal Shopper</h3>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  message.type === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 backdrop-blur-md border border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.type === 'ai' ? (
                    <>
                      <Bot className="w-4 h-4 text-indigo-200" />
                      <span className="text-xs font-medium text-indigo-200">AI Assistant</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-medium text-white/80">You</span>
                    </>
                  )}
                  <span className="text-xs opacity-50 ml-auto">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors"
                      >
                        {suggestion}
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
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-200" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mt-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for a recommendation..."
            className="w-full bg-white text-gray-900 text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none shadow-lg"
          />
          <button
            type="submit"
            disabled={!query.trim() || isTyping}
            className="absolute right-2 top-2 p-1 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-3 text-xs text-indigo-200">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{products.length} products</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Live prices</span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            <span>{watchlist.length} tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIShopperCard;