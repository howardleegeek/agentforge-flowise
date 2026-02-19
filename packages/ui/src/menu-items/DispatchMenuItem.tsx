import React from 'react'
import { Link } from 'react-router-dom'

// Lightweight dispatch menu item. Renders as a router Link for SPA navigation.
export const DispatchMenuItem: React.FC = () => {
    return (
        <Link to='/dispatch' style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: 'inherit' }}>
            Dispatch
        </Link>
    )
}

export default DispatchMenuItem
