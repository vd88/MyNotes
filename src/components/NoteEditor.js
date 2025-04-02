import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNotes } from '../context/NotesContext';
import { Button, IconButton, Chip, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const EditorContainer = styled.div`
  flex: 1;
  background-color: #1a1a1a;
  padding: 20px;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const EditorContent = styled.div`
  height: calc(100% - 100px);
`;

const Title = styled.input`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  width: 100%;
  margin-bottom: 16px;
  &:focus {
    outline: none;
  }
`;

const Content = styled.textarea`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  width: 100%;
  height: calc(100% - 40px);
  resize: none;
  &:focus {
    outline: none;
  }
`;

function NoteEditor() {
  const { state: notesState, dispatch } = useNotes();
  const [content, setContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [localNote, setLocalNote] = useState(null);

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setLocalNote(newNote);  // Update local state
    setContent('');  // Reset content
  };

  useEffect(() => {
    if (notesState.selectedNote) {
      setLocalNote(notesState.selectedNote);
      setContent(notesState.selectedNote.content);
    }
  }, [notesState.selectedNote]);

  const handleSave = () => {
    if (localNote) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          ...localNote,
          content,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  const handleTagClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTagClose = () => {
    setAnchorEl(null);
  };

  // Replace all instances of state with notesState
  if (!notesState.selectedNote && notesState.currentView === 'all-notes') {
    return (
      <EditorContainer>
        <div style={{ textAlign: 'center', marginTop: '40%', color: '#666' }}>
          <Button 
            variant="contained" 
            onClick={handleCreateNote}
            sx={{ marginBottom: 2 }}
          >
            Create New Note
          </Button>
          <div>Select a note or create a new one</div>
        </div>
      </EditorContainer>
    );
  }

  const handleDelete = () => {
    if (localNote) {
      dispatch({ type: 'DELETE_NOTE', payload: localNote.id });
      setAnchorEl(null);
    }
  };

  if (!localNote) {
    return (
      <EditorContainer>
        <div style={{ textAlign: 'center', marginTop: '40%', color: '#666' }}>
          Select a note or create a new one
        </div>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <EditorHeader>
        <div>
          {localNote.tags.map(tag => (
            <Chip key={tag} label={tag} sx={{ marginRight: 1 }} />
          ))}
        </div>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </EditorHeader>
      <EditorContent>
        <Title
          value={localNote.title}
          onChange={(e) => {
            setLocalNote({ ...localNote, title: e.target.value });
            handleSave();
          }}
        />
        <Content
          value={localNote.content}
          onChange={(e) => {
            setLocalNote({ ...localNote, content: e.target.value });
            handleSave();
          }}
        />
      </EditorContent>
    </EditorContainer>
  );
}

export default NoteEditor;