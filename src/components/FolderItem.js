import React, { useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, IconButton, TextField } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useNotes } from '../context/NotesContext';

function FolderItem({ folder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const { dispatch } = useNotes();

  const handleRename = () => {
    if (isEditing && newName.trim()) {
      dispatch({
        type: 'RENAME_FOLDER',
        payload: { id: folder.id, name: newName.trim() }
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <ListItem>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      {isEditing ? (
        <TextField
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
          size="small"
        />
      ) : (
        <ListItemText primary={folder.name} />
      )}
      <IconButton onClick={handleRename}>
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </IconButton>
    </ListItem>
  );
}

export default FolderItem;