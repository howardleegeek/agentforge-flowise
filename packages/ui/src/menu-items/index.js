import dashboard from './dashboard'
import dispatchItem from './DispatchMenuItem'

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
    // Include Dispatch in the main dashboard menu as a first-class entry
    // so the sidebar renders a dedicated Dispatch item alongside other sections.
    items: [dashboard, dispatchItem]
}
