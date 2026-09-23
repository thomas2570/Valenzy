import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  selectedElement: null,
  activeFilter: 'all',
  searchQuery: '',
  theme: 'dark',
  isContactOpen: false,
  isDesktopWarningOpen: false,
  settings: {
    units: { temp: 'C', density: 'g/cm3', energy: 'kJ/mol' },
    animation: { playback: 'running', speed: 0.6 }
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'OPEN_CONTACT':
      return { ...state, isContactOpen: true };
    case 'CLOSE_CONTACT':
      return { ...state, isContactOpen: false };
    case 'OPEN_DESKTOP_WARNING':
      return { ...state, isDesktopWarningOpen: true };
    case 'CLOSE_DESKTOP_WARNING':
      return { ...state, isDesktopWarningOpen: false };
    case 'SELECT_ELEMENT':
      return { ...state, selectedElement: action.payload };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'UPDATE_SETTING':
      return { 
        ...state, 
        settings: { 
          ...state.settings, 
          units: { ...state.settings.units, [action.payload.key]: action.payload.value } 
        } 
      };
    case 'TOGGLE_PLAYBACK':
      return { 
        ...state, 
        settings: { 
          ...state.settings, 
          animation: { 
            ...state.settings.animation, 
            playback: state.settings.animation.playback === 'running' ? 'paused' : 'running' 
          } 
        } 
      };
    case 'SET_ANIMATION_SPEED':
      return { 
        ...state, 
        settings: { 
          ...state.settings, 
          animation: { ...state.settings.animation, speed: action.payload } 
        } 
      };
    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
