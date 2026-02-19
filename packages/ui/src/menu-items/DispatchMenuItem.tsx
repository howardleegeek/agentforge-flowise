import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ListItem, ListItemButton, ListItemText } from '@mui/material'

// Lightweight dispatch menu item.
// Replaced plain Link with MUI ListItem pattern for a more polished look in the sidebar.
export const DispatchMenuItem: React.FC = () => {
    return (
        <ListItem disablePadding component={RouterLink} to='/dispatch'>
            <ListItemButton>
                <ListItemText primary='Dispatch' />
            </ListItemButton>
        </ListItem>
    )
}

export default DispatchMenuItem
