import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ListItemButton, ListItemText } from '@mui/material'

// Lightweight dispatch menu item.
// Use a single MUI ListItemButton that is wired to the RouterLink for clean navigation.
export const DispatchMenuItem: React.FC = () => {
    return (
        <ListItemButton component={RouterLink} to='/dispatch' aria-label='Dispatch'>
            <ListItemText primary='Dispatch' />
        </ListItemButton>
    )
}

export default DispatchMenuItem
