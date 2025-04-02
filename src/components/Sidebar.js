import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import styled from 'styled-components';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Typography, IconButton, Collapse } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import FolderIcon from '@mui/icons-material/Folder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskIcon from '@mui/icons-material/Task';
import StarIcon from '@mui/icons-material/Star';
import HighlightIcon from '@mui/icons-material/Highlight';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Avatar from '@mui/material/Avatar';
import { useUser } from '../context/UserContext';

const SidebarContainer = styled.div`
  width: 260px;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
`;

const DraggableArea = styled.div`
  height: 38px;
  -webkit-app-region: drag;
  background-color: #1a1a1a;
`;

const ScrollableSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 8px 0 8px; // Added top padding
  flex-grow: 1;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #404040;
    border-radius: 3px;
  }
`;

// If you still need more space, you can also add margin to the first SectionHeader
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  &:first-of-type {
    margin-top: 12px; // Add margin to the first section header
  }
`;

const SectionTitle = styled(Typography)`
  color: #888;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

const UserSection = styled.div`
  padding: 16px;
  border-top: 1px solid #404040;
  margin-top: auto;
  display: flex;
  align-items: center;
`;

const StyledListItem = styled(ListItem)`
  margin: 2px 8px;
  border-radius: 6px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
  &.Mui-selected {
    background-color: rgba(255, 255, 255, 0.12);
    &:hover {
      background-color: rgba(255, 255, 255, 0.16);
    }
  }
`;

const StyledListItemIcon = styled(ListItemIcon)`
  color: #888;
  min-width: 40px;
`;

const UserAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`;

const ExpandButton = styled(IconButton)`
  padding: 4px;
  color: #888;
`;

const AnimatedSection = styled.div`
  transition: all 0.3s ease;
`;

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

function Sidebar() {
  const { state, dispatch } = useNotes();
  const { user } = useUser();
  
  // Replace user reference with static data or state
  const userData = {
    name: "Thomas Williams",
    role: "Personal"
  };
  const [expanded, setExpanded] = useState({
    quickLinks: true,
    folders: true,
    tags: true
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleViewChange = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const quickLinks = [
    { id: 'all-notes', icon: <NotesIcon />, label: 'All notes' },
    { id: 'reminders', icon: <AccessTimeIcon />, label: 'Reminders' },
    { id: 'tasks', icon: <TaskIcon />, label: 'Tasks' },
    { id: 'favorites', icon: <StarIcon />, label: 'Favorites' },
    { id: 'highlights', icon: <HighlightIcon />, label: 'Highlights' },
    { id: 'activity', icon: <HistoryIcon />, label: 'Activity' },
    { id: 'saved', icon: <BookmarkIcon />, label: 'Saved' },
  ];

  const handleAddFolder = () => {
    dispatch({ type: 'ADD_FOLDER', payload: `New Folder ${state.folders.length + 1}` });
  };

  const handleAddTag = () => {
    dispatch({ type: 'ADD_TAG', payload: `New Tag ${state.tags.length + 1}` });
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      if (active.data.current.type === 'folder') {
        const oldIndex = state.folders.indexOf(active.id);
        const newIndex = state.folders.indexOf(over.id);
        dispatch({
          type: 'REORDER_FOLDERS',
          payload: arrayMove(state.folders, oldIndex, newIndex)
        });
      } else if (active.data.current.type === 'tag') {
        const oldIndex = state.tags.indexOf(active.id);
        const newIndex = state.tags.indexOf(over.id);
        dispatch({
          type: 'REORDER_TAGS',
          payload: arrayMove(state.tags, oldIndex, newIndex)
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SidebarContainer>
        <ScrollableSection>
          <SectionHeader>
            <SectionTitle>Quick links</SectionTitle>
            <ExpandButton size="small" onClick={() => toggleSection('quickLinks')}>
              {expanded.quickLinks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ExpandButton>
          </SectionHeader>
          <Collapse in={expanded.quickLinks}>
            <List>
              {quickLinks.map(({ id, icon, label }) => (
                <StyledListItem 
                  button 
                  key={id}
                  selected={state.view === id}
                  onClick={() => handleViewChange(id)}
                >
                  <StyledListItemIcon>{icon}</StyledListItemIcon>
                  <ListItemText primary={label} />
                </StyledListItem>
              ))}
            </List>
          </Collapse>

          <SectionHeader>
            <SectionTitle>Folders</SectionTitle>
            <div>
              <IconButton size="small" onClick={handleAddFolder}>
                <AddIcon fontSize="small" sx={{ color: '#888' }} />
              </IconButton>
              <ExpandButton size="small" onClick={() => toggleSection('folders')}>
                {expanded.folders ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ExpandButton>
            </div>
          </SectionHeader>
          <Collapse in={expanded.folders}>
            <SortableContext
              items={state.folders || []}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {(state.folders || []).map((folder) => (
                  <SortableItem key={folder.id} id={folder.id}>
                    <StyledListItem
                      button
                      selected={state.view === `folder-${folder.id}`}
                      onClick={() => handleViewChange(`folder-${folder.id}`)}
                    >
                      <StyledListItemIcon>
                        <FolderIcon />
                      </StyledListItemIcon>
                      <ListItemText primary={folder.name} />
                    </StyledListItem>
                  </SortableItem>
                ))}
              </List>
            </SortableContext>
          </Collapse>

          {/* Implement Tags section similarly */}
          
          {/* Trash section remains the same */}
        </ScrollableSection>

        <UserSection>
          <UserAvatar>{user.initials}</UserAvatar>
          <ListItemText 
            primary={user.displayName} 
            secondary={user.accountType}
            primaryTypographyProps={{ style: { fontWeight: 500, color: '#fff' } }}
            secondaryTypographyProps={{ style: { color: '#888' } }}
          />
        </UserSection>
      </SidebarContainer>
    </DndContext>
  );
}

export default Sidebar;