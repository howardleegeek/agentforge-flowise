// Lightweight Dispatch menu item adapter
// This module provides the Dispatch entry for the left navigation menu.
// Keeping it minimal avoids dependencies on icon libraries for this patch
// and aligns with the existing dashboard-driven structure.

const dispatchItem = {
    id: 'dispatch',
    title: 'Dispatch',
    type: 'item',
    url: '/dispatch',
    breadcrumbs: true,
    permission: 'dispatch:view'
}

export default dispatchItem
