import { createContext, useContext, useReducer, useCallback } from 'react';

// Location Types
const SET_LOCATION = 'SET_LOCATION';
const CLEAR_LOCATION = 'CLEAR_LOCATION';

// Cart Types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SET_CART = 'SET_CART';

// Search Types
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const CLEAR_SEARCH = 'CLEAR_SEARCH';

// Initial State
const initialState = {
  location: {
    displayName: '',
    areaName: '',
    fullAddress: '',
    lat: null,
    lon: null,
  },
  cart: {
    items: [],
    totalCount: 0,
    totalPrice: 0,
  },
  search: {
    query: '',
  },
};

// Load persisted state
const loadPersistedState = () => {
  try {
    const location = JSON.parse(localStorage.getItem('haveit_location')) || initialState.location;
    const cart = JSON.parse(localStorage.getItem('haveit_cart')) || initialState.cart;
    return { location, cart, search: initialState.search };
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
    
    case ADD_TO_CART: {
      const existingItem = state.cart.items.find(item => item.id === action.payload.id);
      let newItems;
      if (existingItem) {
        newItems = state.cart.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.cart.items, { ...action.payload, quantity: 1 }];
      }
      const newState = {
        ...state,
        cart: {
          items: newItems,
          totalCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        },
      };
      localStorage.setItem('haveit_cart', JSON.stringify(newState.cart));
      return newState;
    }
    
    case REMOVE_FROM_CART: {
      const newItems = state.cart.items.filter(item => item.id !== action.payload);
      const newState = {
        ...state,
        cart: {
          items: newItems,
          totalCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        },
      };
      localStorage.setItem('haveit_cart', JSON.stringify(newState.cart));
      return newState;
    }
    
    case UPDATE_QUANTITY: {
      const newItems = state.cart.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      const newState = {
        ...state,
        cart: {
          items: newItems,
          totalCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        },
      };
      localStorage.setItem('haveit_cart', JSON.stringify(newState.cart));
      return newState;
    }
    
    case CLEAR_CART:
      localStorage.removeItem('haveit_cart');
      return { ...state, cart: initialState.cart };
    
    case SET_CART:
      return { ...state, cart: action.payload };
    
    case SET_SEARCH_QUERY:
      return { ...state, search: { query: action.payload } };
    case CLEAR_SEARCH:
      return { ...state, search: { query: '' } };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);

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

  // Cart Actions
  const addToCart = useCallback((item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CLEAR_CART });
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
    cart: state.cart,
    search: state.search,
    setLocation,
    clearLocation,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSearchQuery,
    clearSearch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
