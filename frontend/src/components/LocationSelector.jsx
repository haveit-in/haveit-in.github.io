import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../context/useApp.js';
import { LocationIcon, ChevronDownIcon } from './Icons.jsx';

// CrossIcon component
const CrossIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// TargetIcon component for current location
const TargetIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" x2="12" y1="2" y2="5" />
    <line x1="12" x2="12" y1="19" y2="22" />
    <line x1="2" x2="5" y1="12" y2="12" />
    <line x1="19" x2="22" y1="12" y2="12" />
  </svg>
);

export default function LocationSelector({ isMobile = false, isHeader = false }) {
  const { location, setLocation } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Fetch suggestions from Nominatim API
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&countrycodes=in&limit=5`,
        {
          headers: {
            'User-Agent': 'HaveitApp/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch {
      setError('Unable to fetch locations. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce input changes
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for 300ms debounce
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  }, [fetchSuggestions]);

  // Get current location using geolocation API
  const handleGetCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'User-Agent': 'HaveitApp/1.0',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to reverse geocode location');
          }

          const data = await response.json();
          setLocation(data);
          setIsOpen(false);
          setQuery('');
          setSuggestions([]);
        } catch {
          setError('Unable to get your location. Please try again.');
        } finally {
          setGettingLocation(false);
        }
      },
      () => {
        setGettingLocation(false);
        setError('Unable to access your location. Please check your browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [setLocation]);

  // Handle location selection
  const handleSelectLocation = useCallback((locationData) => {
    setLocation(locationData);
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
  }, [setLocation]);

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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const displayText = location.areaName || 'Select Location';
  const truncatedDisplayText = displayText.length > 15 ? `${displayText.slice(0, 15)}...` : displayText;
  const subText = location.areaName ? '' : 'Tap to choose';

  const desktopButtonClass = isHeader
    ? 'inline-flex items-center gap-3 h-10 min-w-[160px] rounded-full border border-gray-200 bg-white px-4 shadow-sm text-sm font-medium text-gray-900 transition hover:shadow-md focus:outline-none focus:ring-0 focus:border-[#E8711A] max-w-[220px]'
    : 'flex items-center gap-2 h-10 min-w-[160px] rounded-full border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 transition hover:shadow-md focus:outline-none focus:ring-0 focus:border-[#E8711A] max-w-[220px]';

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 text-left w-full rounded-full border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#E8711A]"
        aria-label="Select delivery location"
      >
        <LocationIcon size={18} className="text-[#E8711A] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
            <span className="relative block truncate max-w-full">
              <span className="truncate block">{truncatedDisplayText}</span>
              {displayText.length > 15 && (
                <span className="pointer-events-none absolute left-0 bottom-full mb-2 hidden w-max max-w-[220px] whitespace-normal rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block">
                  {displayText}
                </span>
              )}
            </span>
            <ChevronDownIcon size={10} className="flex-shrink-0" />
          </p>
        </div>
      </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-3">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#E8711A] focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LocationIcon size={16} className="text-gray-400" />
                </div>
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                      inputRef.current?.focus();
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <CrossIcon size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors disabled:opacity-50"
              >
                <TargetIcon size={16} className={gettingLocation ? 'animate-spin' : ''} />
                <span>{gettingLocation ? 'Getting location...' : 'Use my current location'}</span>
              </button>

              {loading && (
                <div className="mt-3 text-center text-sm text-gray-500 py-2">
                  <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#E8711A] rounded-full animate-spin mr-2" />
                  Searching...
                </div>
              )}

              {error && (
                <div className="mt-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {suggestions.length > 0 && !loading && (
                <ul className="mt-2 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li key={suggestion.place_id || index}>
                      <button
                        onClick={() => handleSelectLocation(suggestion)}
                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.display_name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {suggestion.display_name}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && !error && query && suggestions.length === 0 && (
                <div className="mt-3 text-center text-sm text-gray-500 py-2">
                  No locations found for &quot;{query}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${desktopButtonClass} group`}
        aria-label="Select delivery location"
      >
        <LocationIcon size={18} className="text-[#E8711A] flex-shrink-0" />
        <div className="text-left min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[170px]">
            <span className="relative block truncate max-w-full">
              <span className="truncate block">{truncatedDisplayText}</span>
              {displayText.length > 15 && (
                <span className="pointer-events-none absolute left-0 bottom-full mb-2 hidden w-max max-w-[220px] whitespace-normal rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block">
                  {displayText}
                </span>
              )}
            </span>
          </p>
          {subText && (
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              {subText} <ChevronDownIcon size={10} />
            </p>
          )}
        </div>
        {location.areaName && <ChevronDownIcon size={10} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="p-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for area, street..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8711A] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LocationIcon size={16} className="text-gray-400" />
              </div>
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <CrossIcon size={14} />
                </button>
              )}
            </div>

            <button
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
            >
              <TargetIcon size={16} className={gettingLocation ? 'animate-spin' : ''} />
              <span>{gettingLocation ? 'Getting location...' : 'Use my current location'}</span>
            </button>

            {loading && (
              <div className="mt-3 text-center text-sm text-gray-500 py-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#E8711A] rounded-full animate-spin mr-2" />
                Searching...
              </div>
            )}

            {error && (
              <div className="mt-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {suggestions.length > 0 && !loading && (
              <ul className="mt-2 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li key={suggestion.place_id || index}>
                    <button
                      onClick={() => handleSelectLocation(suggestion)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.display_name.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {suggestion.display_name}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!loading && !error && query && suggestions.length === 0 && (
              <div className="mt-3 text-center text-sm text-gray-500 py-2">
                No locations found for &quot;{query}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
