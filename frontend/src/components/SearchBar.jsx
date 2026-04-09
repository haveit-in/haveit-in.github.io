import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useApp } from '../context/useApp.js';
import { SearchIcon } from './Icons.jsx';

// Search data combining dishes, restaurants, and categories
const searchData = [
  // Food dishes
  { id: 'dish-1', name: 'Biryani', type: 'Food', category: 'Food', price: 240, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop' },
  { id: 'dish-2', name: 'Pizza', type: 'Dish', category: 'Food', price: 299, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop' },
  { id: 'dish-3', name: 'Dosa', type: 'Dish', category: 'Food', price: 120, image: 'https://images.unsplash.com/photo-1665660716988-1f472b8e7d50?w=100&h=100&fit=crop' },
  { id: 'dish-4', name: 'Paneer Butter Masala', type: 'Dish', category: 'Food', price: 180, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100&h=100&fit=crop' },
  { id: 'dish-5', name: 'Burger', type: 'Dish', category: 'Food', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop' },
  { id: 'dish-6', name: 'Fries', type: 'Dish', category: 'Food', price: 99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&h=100&fit=crop' },
  { id: 'dish-7', name: 'Noodles', type: 'Dish', category: 'Food', price: 149, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop' },
  { id: 'dish-8', name: 'Tandoori Chicken', type: 'Dish', category: 'Food', price: 349, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop' },
  { id: 'dish-9', name: 'Idli', type: 'Dish', category: 'Food', price: 80, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100&h=100&fit=crop' },
  { id: 'dish-10', name: 'Vada', type: 'Dish', category: 'Food', price: 70, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=100&h=100&fit=crop' },
  { id: 'dish-11', name: 'Sambar', type: 'Dish', category: 'Food', price: 60, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100&h=100&fit=crop' },
  { id: 'dish-12', name: 'Shawarma', type: 'Dish', category: 'Food', price: 150, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop' },
  { id: 'dish-13', name: 'Salad', type: 'Dish', category: 'Food', price: 129, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop' },
  { id: 'dish-14', name: 'Cake', type: 'Dessert', category: 'Food', price: 399, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop' },
  { id: 'dish-15', name: 'Ice Cream', type: 'Dessert', category: 'Food', price: 89, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&h=100&fit=crop' },
  { id: 'dish-16', name: 'Milkshake', type: 'Beverage', category: 'Beverages', price: 129, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=100&h=100&fit=crop' },
  { id: 'dish-17', name: 'Rolls', type: 'Dish', category: 'Food', price: 139, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&h=100&fit=crop' },
  { id: 'dish-18', name: 'Chinese Noodles', type: 'Dish', category: 'Food', price: 169, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop' },
  { id: 'dish-19', name: 'Manchuria', type: 'Dish', category: 'Food', price: 149, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=100&h=100&fit=crop' },
  { id: 'dish-20', name: 'Dal Makhani', type: 'Dish', category: 'Food', price: 189, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop' },
  
  // Restaurants
  { id: 'rest-1', name: 'Biryani House', type: 'Restaurant', category: 'Food', rating: 4.5 },
  { id: 'rest-2', name: 'Pizza Hut', type: 'Restaurant', category: 'Food', rating: 4.3 },
  { id: 'rest-3', name: 'Dominos', type: 'Restaurant', category: 'Food', rating: 4.4 },
  { id: 'rest-4', name: 'Dosa Corner', type: 'Restaurant', category: 'Food', rating: 4.6 },
  { id: 'rest-5', name: 'Burger King', type: 'Restaurant', category: 'Food', rating: 4.2 },
  { id: 'rest-6', name: 'KFC', type: 'Restaurant', category: 'Food', rating: 4.1 },
  { id: 'rest-7', name: 'Chinese Wok', type: 'Restaurant', category: 'Food', rating: 4.0 },
  { id: 'rest-8', name: 'Tandoori Nights', type: 'Restaurant', category: 'Food', rating: 4.5 },
  { id: 'rest-9', name: 'South Indian Cafe', type: 'Restaurant', category: 'Food', rating: 4.4 },
  { id: 'rest-10', name: 'Sweet Tooth', type: 'Restaurant', category: 'Food', rating: 4.3 },
  
  // Groceries
  { id: 'groc-1', name: 'Apples', type: 'Grocery', category: 'Groceries', price: 120 },
  { id: 'groc-2', name: 'Bananas', type: 'Grocery', category: 'Groceries', price: 60 },
  { id: 'groc-3', name: 'Tomatoes', type: 'Grocery', category: 'Groceries', price: 40 },
  { id: 'groc-4', name: 'Potatoes', type: 'Grocery', category: 'Groceries', price: 35 },
  { id: 'groc-5', name: 'Onions', type: 'Grocery', category: 'Groceries', price: 30 },
  { id: 'groc-6', name: 'Rice', type: 'Grocery', category: 'Groceries', price: 80 },
  { id: 'groc-7', name: 'Wheat Flour', type: 'Grocery', category: 'Groceries', price: 55 },
  { id: 'groc-8', name: 'Milk', type: 'Grocery', category: 'Groceries', price: 60 },
  { id: 'groc-9', name: 'Eggs', type: 'Grocery', category: 'Groceries', price: 90 },
  { id: 'groc-10', name: 'Bread', type: 'Grocery', category: 'Groceries', price: 35 },
  
  // Beverages
  { id: 'bev-1', name: 'Coca Cola', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-2', name: 'Pepsi', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-3', name: 'Sprite', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-4', name: 'Fanta', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-5', name: 'Maaza', type: 'Beverage', category: 'Beverages', price: 45 },
  { id: 'bev-6', name: 'Slice', type: 'Beverage', category: 'Beverages', price: 45 },
  { id: 'bev-7', name: 'Red Bull', type: 'Beverage', category: 'Beverages', price: 110 },
  { id: 'bev-8', name: 'Cold Coffee', type: 'Beverage', category: 'Beverages', price: 99 },
  { id: 'bev-9', name: 'Fresh Juice', type: 'Beverage', category: 'Beverages', price: 79 },
  { id: 'bev-10', name: 'Lassi', type: 'Beverage', category: 'Beverages', price: 59 },
  
  // Fresh items
  { id: 'fresh-1', name: 'Fresh Vegetables Box', type: 'Fresh', category: 'Fresh', price: 199 },
  { id: 'fresh-2', name: 'Fruits Basket', type: 'Fresh', category: 'Fresh', price: 249 },
  { id: 'fresh-3', name: 'Organic Greens', type: 'Fresh', category: 'Fresh', price: 89 },
  { id: 'fresh-4', name: 'Fresh Herbs', type: 'Fresh', category: 'Fresh', price: 49 },
  { id: 'fresh-5', name: 'Sprouts', type: 'Fresh', category: 'Fresh', price: 39 },
];

// Highlight matched text
function HighlightedText({ text, query }) {
  if (!query) return <span>{text}</span>;
  
  const fuse = new Fuse([text], { keys: [''], threshold: 0.4 });
  const matches = fuse.search(query);
  
  if (matches.length === 0) return <span>{text}</span>;
  
  const match = matches[0];
  const indices = match.matches?.[0]?.indices || [];
  
  if (indices.length === 0) return <span>{text}</span>;
  
  const parts = [];
  let lastIndex = 0;
  
  // Sort and merge overlapping indices
  const sortedIndices = indices.sort((a, b) => a[0] - b[0]);
  const mergedIndices = [];
  
  for (const [start, end] of sortedIndices) {
    if (mergedIndices.length === 0 || start > mergedIndices[mergedIndices.length - 1][1]) {
      mergedIndices.push([start, end]);
    } else {
      mergedIndices[mergedIndices.length - 1][1] = Math.max(mergedIndices[mergedIndices.length - 1][1], end);
    }
  }
  
  for (const [start, end] of mergedIndices) {
    if (start > lastIndex) {
      parts.push(<span key={`before-${start}`}>{text.slice(lastIndex, start)}</span>);
    }
    parts.push(
      <mark key={`highlight-${start}`} className="bg-[#E8711A]/20 text-[#E8711A] font-semibold rounded px-0.5">
        {text.slice(start, end + 1)}
      </mark>
    );
    lastIndex = end + 1;
  }
  
  if (lastIndex < text.length) {
    parts.push(<span key={`after-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }
  
  return <>{parts}</>;
}

export default function SearchBar({ 
  placeholder = "Search",
  isMobile = false,
  onSearch 
}) {
  const { setSearchQuery } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Initialize Fuse
  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'type', weight: 0.2 },
        { name: 'category', weight: 0.2 },
      ],
      threshold: 0.4,
      includeMatches: true,
      minMatchCharLength: 1,
    });
  }, []);

  // Perform search with debounce
  const performSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.search(searchQuery, { limit: 10 });
    setResults(searchResults);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [fuse]);

  // Debounce input changes
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  // Handle result selection
  const handleSelectResult = useCallback((result) => {
    setQuery(result.item.name);
    setSearchQuery(result.item.name);
    setIsOpen(false);
    if (onSearch) {
      onSearch(result.item);
    }
  }, [setSearchQuery, onSearch]);

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        } else if (query.trim()) {
          // Search with current query
          setSearchQuery(query);
          setIsOpen(false);
          if (onSearch) {
            onSearch({ name: query, type: 'Search', category: 'All' });
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex, handleSelectResult, query, setSearchQuery, onSearch]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups = {};
    results.forEach((result) => {
      const category = result.item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
    });
    return groups;
  }, [results]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key (global)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food': return 'bg-orange-100 text-orange-700';
      case 'Groceries': return 'bg-green-100 text-green-700';
      case 'Beverages': return 'bg-blue-100 text-blue-700';
      case 'Fresh': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const inputClasses = isMobile
    ? "block w-full h-10 pl-10 pr-4 border border-gray-200 rounded-full bg-white text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8711A]/30 focus:border-[#E8711A]"
    : "block w-full h-10 pl-11 pr-4 border border-gray-200 rounded-full bg-white text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8711A]/30 focus:border-[#E8711A]";

  return (
    <div className={`relative h-10 ${isMobile ? 'w-full' : 'max-w-[220px]'}`} ref={dropdownRef}>
      <div className="relative rounded-full overflow-hidden h-10">
        <div className={`absolute inset-y-0 left-0 ${isMobile ? 'pl-3' : 'pl-4'} flex items-center pointer-events-none`}>
          <SearchIcon size={isMobile ? 18 : 18} className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
          className={inputClasses}
          placeholder={placeholder}
          aria-label="Search for dishes, groceries, or more"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden ${isMobile ? 'max-h-[60vh]' : 'max-h-96'}`}>
          {results.length > 0 ? (
            <div className="overflow-y-auto max-h-[inherit]">
              {Object.entries(groupedResults).map(([category, categoryResults]) => (
                <div key={category}>
                  <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${getCategoryColor(category)}`}>
                    {category}
                  </div>
                  <ul>
                    {categoryResults.map((result) => {
                      const globalIndex = results.indexOf(result);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <li key={result.item.id}>
                          <button
                            onClick={() => handleSelectResult(result)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                              isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            {result.item.image && (
                              <img 
                                src={result.item.image} 
                                alt={result.item.name}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            {!result.item.image && (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-400 text-xs">
                                  {result.item.type?.[0] || '?'}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                <HighlightedText text={result.item.name} query={query} />
                              </p>
                              <p className="text-xs text-gray-500">
                                {result.item.type}
                                {result.item.price && ` • ₹${result.item.price}`}
                                {result.item.rating && ` • ★${result.item.rating}`}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">
                No results for <span className="font-medium text-gray-900">&quot;{query}&quot;</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for dishes, restaurants, or groceries
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
