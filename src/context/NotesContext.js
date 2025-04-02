import React, { createContext, useContext, useReducer } from 'react';

const NotesContext = createContext();

const initialState = {
  notes: [],
  folders: [],
  tags: [],
  tasks: [],  // Initialize empty tasks array
  view: 'all-notes',
  selectedNote: null,
  currentView: 'all-notes'
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload],
        selectedNote: action.payload,  // Select the new note automatically
        currentView: 'all-notes'  // Switch to all-notes view
      };
    
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
        selectedNote: null  // Clear selected note when changing views
      };
    case 'ADD_FOLDER':
      return {
        ...state,
        folders: [...state.folders, {
          id: Date.now().toString(),
          name: action.payload
        }]
      };
    case 'REORDER_FOLDERS':
      return {
        ...state,
        folders: action.payload
      };
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload],
        selectedNote: action.payload
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload]
      };
    case 'RENAME_FOLDER':
      return {
        ...state,
        folders: state.folders.map(folder => 
          folder.id === action.payload.id ? { ...folder, name: action.payload.name } : folder
        )
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
        selectedNote: null
      };
    case 'INIT_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        selectedNote: action.payload
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? action.payload : note
        )
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
        selectedNote: null
      };
    case 'SET_SELECTED_NOTE':
      return { ...state, selectedNote: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.payload] };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
      
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload]
      };
      
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
      
    case 'ADD_HIGHLIGHT':
      return {
        ...state,
        highlights: [...state.highlights, action.payload]
      };
      
    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  
  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);