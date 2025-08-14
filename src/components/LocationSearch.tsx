import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';
import { useLocation } from '../hooks/useLocation';
import type { Location } from '../services/locationService';

const LocationSearch: React.FC = () => {
  const {
    searchResults,
    isSearching,
    handleSearch,
    selectLocation,
    currentLocation,
    requestCurrentLocation,
    recentSearches
  } = useLocation();

  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input changes with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim().length >= 2) {
        handleSearch(inputValue);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, handleSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (location: Location) => {
    selectLocation(location);
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleCurrentLocation = () => {
    requestCurrentLocation();
    setInputValue('');
    setShowDropdown(false);
  };

  // Combine search results and recent searches for dropdown
  const dropdownItems = inputValue.trim().length >= 2
    ? searchResults
    : recentSearches.slice(0, 5);

  const showRecentSearches = inputValue.trim().length < 2 && recentSearches.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto mb-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-white/60" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
        />
        
        {/* Clear button */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FiX className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
          </button>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (dropdownItems.length > 0 || showRecentSearches) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
          >
            {/* Current Location Button */}
            <button
              onClick={handleCurrentLocation}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
            >
              <div className="p-2 bg-white/10 rounded-lg">
                <FiMapPin className="h-4 w-4 text-white" />
              </div>
              <div className="text-white">
                <div className="font-medium">Use Current Location</div>
                <div className="text-xs text-white/60">Get weather for your location</div>
              </div>
            </button>

            {/* Divider */}
            {dropdownItems.length > 0 && (
              <div className="border-t border-white/10" />
            )}

            {/* Section Header */}
            {showRecentSearches && dropdownItems.length > 0 && (
              <div className="px-4 py-2 text-xs text-white/50 uppercase tracking-wider">
                Recent Searches
              </div>
            )}

            {/* Location Results */}
            {dropdownItems.map((location, index) => (
              <button
                key={`${location.latitude}-${location.longitude}-${index}`}
                onClick={() => handleSelectLocation(location)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
              >
                <div className="p-2 bg-white/10 rounded-lg">
                  <FiMapPin className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex-1 text-white">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-white/60">
                    {location.state ? `${location.state}, ` : ''}{location.country}
                  </div>
                </div>
                {currentLocation?.latitude === location.latitude && 
                 currentLocation?.longitude === location.longitude && (
                  <div className="text-xs text-white/50">Current</div>
                )}
              </button>
            ))}

            {/* No results message */}
            {!showRecentSearches && inputValue.trim().length >= 2 && dropdownItems.length === 0 && !isSearching && (
              <div className="px-4 py-3 text-center text-white/50">
                No locations found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search hint */}
      {!showDropdown && !currentLocation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-center text-xs text-white/40"
        >
          Try searching for "San Francisco", "Denver", or "New York"
        </motion.p>
      )}
    </div>
  );
};

export default LocationSearch;