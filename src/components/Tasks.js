import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotes } from '../context/NotesContext';
import { Button, Checkbox, List, ListItem, ListItemText, TextField } from '@mui/material';

const TasksContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #1a1a1a;
  color: white;
`;

function Tasks() {
  const { state: notesState, dispatch } = useNotes();
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: Date.now(),
          content: newTask,
          completed: false,
          createdAt: new Date().toISOString()
        }
      });
      setNewTask('');
    }
  };

  return (
    <TasksContainer>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
          variant="outlined"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
      </div>
      <List>
        {(notesState.tasks || []).map(task => (
          <ListItem key={task.id}>
            <Checkbox
              checked={task.completed}
              onChange={() => dispatch({
                type: 'TOGGLE_TASK',
                payload: task.id
              })}
            />
            <ListItemText primary={task.content} />
          </ListItem>
        ))}
      </List>
    </TasksContainer>
  );
}

export default Tasks;