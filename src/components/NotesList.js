import React from 'react';
import styled from 'styled-components';
import { List, ListItem, ListItemText, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNotes } from '../context/NotesContext';
import { format } from 'date-fns';

const NotesListContainer = styled.div`
  width: 300px;
  background-color: #2d2d2d;
  border-right: 1px solid #404040;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #363636;
`;

const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

function NotesList() {
  const { state, dispatch } = useNotes();
  
  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
  };

  const filteredNotes = state.notes.filter(note => 
    note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <NotesListContainer>
      <SearchBar>
        <SearchIcon sx={{ marginRight: 1 }} />
        <InputBase
          placeholder="Search..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ 
            type: 'SET_SEARCH_QUERY', 
            payload: e.target.value 
          })}
          sx={{ color: 'white', width: '100%' }}
        />
      </SearchBar>
      <NotesHeader>
        <h2>All notes</h2>
        <IconButton color="primary" onClick={createNewNote}>
          <AddIcon />
        </IconButton>
      </NotesHeader>
      <List>
        {filteredNotes.map(note => (
          <ListItem 
            button 
            key={note.id}
            selected={state.selectedNote?.id === note.id}
            onClick={() => dispatch({ 
              type: 'SET_SELECTED_NOTE', 
              payload: note 
            })}
          >
            <ListItemText 
              primary={note.title}
              secondary={`${format(new Date(note.createdAt), 'dd/MM/yyyy')} ${note.content.slice(0, 30)}...`}
            />
          </ListItem>
        ))}
      </List>
    </NotesListContainer>
  );
}

export default NotesList;