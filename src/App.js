import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { NotesProvider, useNotes } from './context/NotesContext';
import Tasks from './components/Tasks';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
  },
});

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
`;

function AppContent() {
  const { state: notesState } = useNotes();

  const renderView = () => {
    switch (notesState.currentView) {
      case 'tasks':
        return <Tasks />;
      case 'all-notes':
      default:
        return <NoteEditor />;
    }
  };

  return (
    <AppContainer>
      <Sidebar />
      {renderView()}
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
