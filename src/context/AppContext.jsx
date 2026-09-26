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
    animation: { playback: 'running', speed: 0.6 },
    liteMode: false,
    language: 'en'
  },
  user: undefined,
  userProfile: undefined,
  session: null
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
    case 'TOGGLE_LITE_MODE':
      return {
        ...state,
        settings: { ...state.settings, liteMode: !state.settings.liteMode }
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        settings: { ...state.settings, language: action.payload }
      };
    case 'SET_USER':
      return { ...state, user: action.payload.user, session: action.payload.session };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    default:
      return state;
  }
}

import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  React.useEffect(() => {
    let profileUnsubscribe = null;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'SET_USER', payload: { user, session: null } });
      
      if (user) {
        profileUnsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            dispatch({ type: 'SET_USER_PROFILE', payload: docSnap.data() });
          } else {
            dispatch({ type: 'SET_USER_PROFILE', payload: null });
          }
        });
      } else {
        if (profileUnsubscribe) profileUnsubscribe();
        dispatch({ type: 'SET_USER_PROFILE', payload: null });
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export const TRANSLATIONS = {
  en: {
    footer_explore: "Explore Elements",
    footer_practice: "Practice & Lab",
    footer_legal: "Platform & Legal",
    footer_account: "Account",
    nav_home: "Home",
    nav_about: "About",
    nav_contact: "Contact",
    nav_table: "Table",
    nav_tools: "Tools",
    nav_ions: "Ions",
    nav_quiz: "Quiz",
    nav_settings: "Settings"
  },
  hi: {
    footer_explore: "तत्वों का अन्वेषण करें",
    footer_practice: "अभ्यास और प्रयोगशाला",
    footer_legal: "मंच और कानूनी",
    footer_account: "खाता",
    nav_home: "होम",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क करें",
    nav_table: "आवर्त सारणी",
    nav_tools: "उपकरण",
    nav_ions: "आयनों",
    nav_quiz: "प्रश्नोत्तरी",
    nav_settings: "सेटिंग्स"
  }
};

export function useTranslation() {
  const { state } = useAppContext();
  const lang = state?.settings?.language || 'en';
  return (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
}
