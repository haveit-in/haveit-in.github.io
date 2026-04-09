import { useReducer, useCallback } from 'react';
import { AppContext } from './AppContext.js';
import {
  SET_LOCATION,
  CLEAR_LOCATION,
  SET_SEARCH_QUERY,
  CLEAR_SEARCH,
} from './actionTypes.js';

// Initial State
const initialState = {
  location: {
    displayName: '',
    areaName: '',
    fullAddress: '',
    lat: null,
    lon: null,
  },
  search: {
    query: '',
  },
};

// Load persisted state
const loadPersistedState = () => {
  try {
    const location = JSON.parse(localStorage.getItem('haveit_location')) || initialState.location;
    return { location, search: initialState.search };
  } catch {
    return initialState;
  }
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case CLEAR_LOCATION:
      return { ...state, location: initialState.location };
    
    case SET_SEARCH_QUERY:
      return { ...state, search: { query: action.payload } };
    case CLEAR_SEARCH:
      return { ...state, search: { query: '' } };
    
    default:
      return state;
  }
}

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, loadPersistedState());

  // Location Actions
  const setLocation = useCallback((locationData) => {
    const areaName = locationData.address?.suburb || 
                     locationData.address?.neighbourhood || 
                     locationData.address?.locality || 
                     locationData.address?.city || 
                     locationData.address?.town ||
                     locationData.address?.village ||
                     locationData.display_name?.split(',')[0] ||
                     'Unknown Location';
    
    const location = {
      displayName: locationData.display_name,
      areaName: areaName,
      fullAddress: locationData.display_name,
      lat: locationData.lat,
      lon: locationData.lon,
    };
    
    localStorage.setItem('haveit_location', JSON.stringify(location));
    dispatch({ type: SET_LOCATION, payload: location });
  }, []);

  const clearLocation = useCallback(() => {
    localStorage.removeItem('haveit_location');
    dispatch({ type: CLEAR_LOCATION });
  }, []);

  // Search Actions
  const setSearchQuery = useCallback((query) => {
    dispatch({ type: SET_SEARCH_QUERY, payload: query });
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: CLEAR_SEARCH });
  }, []);

  const value = {
    location: state.location,
    search: state.search,
    setLocation,
    clearLocation,
    setSearchQuery,
    clearSearch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
