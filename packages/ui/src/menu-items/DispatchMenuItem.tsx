import React from 'react'

// Lightweight dispatch menu item. Renders as a simple anchor for navigation.
export const DispatchMenuItem: React.FC = () => {
    return (
        <a href='/dispatch' style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: 'inherit' }}>
            Dispatch
        </a>
    )
}

export default DispatchMenuItem
