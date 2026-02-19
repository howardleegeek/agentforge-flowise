import React from 'react'
import DispatchDashboard from './DispatchDashboard'

const DispatchPage: React.FC = () => {
    return (
        <div>
            <DispatchDashboard />
        </div>
    )
}

export default DispatchPage

// Re-export the underlying DispatchDashboard for easier direct imports
// (e.g. in tests or alternative wrappers) without duplicating component code.
export { default as DispatchDashboard } from './DispatchDashboard'
