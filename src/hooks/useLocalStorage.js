import { useEffect } from 'react';
import { useNotes } from '../context/NotesContext';

export function useLocalStorage() {
  const { state, dispatch } = useNotes();

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      dispatch({ 
        type: 'INIT_NOTES', 
        payload: JSON.parse(savedNotes) 
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes]);
}