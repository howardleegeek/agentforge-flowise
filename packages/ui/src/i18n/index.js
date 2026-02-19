import i18next from 'i18next'

// Expose default language for external tooling/tests if needed
// Default language is Chinese. Also support reading from localStorage to
// persist user preference across reloads.
export const DEFAULT_LANGUAGE = 'zh'

// Resolve initial language from localStorage if available, otherwise fall back
// to the compiled DEFAULT_LANGUAGE.
const getInitialLanguage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('i18nLng')
        if (saved) return saved
    }
    return DEFAULT_LANGUAGE
}

// Load Chinese translations from a separate module to simplify maintenance
// and to avoid JSON import pitfalls in some runtimes.
import zh from '../../../../i18n/zh.js'

// Minimal i18n instance for tests and runtime without React bindings.
const resources = {
    zh: zh,
    en: {
        translation: {
            Providers: 'Providers',
            Active: 'Active',
            Settings: 'Settings',
            // Mirror keys for Chinese translations to support switching back to English
            Upgrade: 'Upgrade',
            Workspaces: 'Workspaces',
            Marketplace: 'Marketplace',
            Search: 'Search',
            'Search nodes': 'Search nodes',
            'Clear Search': 'Clear Search',
            'Add Nodes': 'Add Nodes',
            'What would you like to build?': 'What would you like to build?',
            'Agentflow generation description': 'Agentflow generation description',
            Language: 'Language',
            // Add missing English keys to keep parity with Chinese translations
            'Search Name/Description/Node': 'Search Name/Description/Node',
            Category: 'Category',
            Nodes: 'Nodes',
            'Last Modified Date': 'Last Modified Date',
            Actions: 'Actions',
            NEW: 'New',
            Chinese: 'Chinese',
            English: 'English',
            Cancel: 'Cancel',
            Save: 'Save',
            Delete: 'Delete',
            Edit: 'Edit',
            Users: 'Users',
            Last: 'Last',
            LastUpdated: 'Last Updated',
            Name: 'Name',
            Description: 'Description',
            'Chat Models': 'Chat Models',
            Chatflow: 'Chatflow',
            AgentflowV2: 'Agentflow V2',
            Tool: 'Tool',
            'Text Splitters': 'Text Splitters',
            'Document Loaders': 'Document Loaders',
            Embeddings: 'Embeddings',
            'Vector Stores': 'Vector Stores',
            'Record Manager': 'Record Manager',
            Tools: 'Tools',
            'Tools (MCP)': 'Tools (MCP)',
            LangChain: 'LangChain',
            LlamaIndex: 'LlamaIndex',
            AgentFlows: 'Agent Flows',
            'Multi Agents': 'Multi Agents',
            'Sequential Agents': 'Sequential Agents',
            'Explore and use pre-built templates': 'Explore and use pre-built templates',
            // Additional UI strings that are used in the app but were
            // missing from the Chinese translations. Providing translations
            // here helps ensure the UI remains fully localized when the
            // language is switched to Chinese.
            'Card View': 'Card View',
            'List View': 'List View',
            Inactive: 'Inactive',
            'Search Name/Description/Node': 'Search Name/Description/Node'
        }
    }
}

const i18n = i18next.createInstance()
i18n.init({
    resources,
    lng: getInitialLanguage(), // initialize to stored language or Chinese by default
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: { escapeValue: false }
}).catch((err) => {
    // Critical path: ensure we log for debugging but do not crash build/tests
    console.error('i18n init failed', err)
})

export const SUPPORTED_LANGUAGES = ['zh', 'en']

export const setLanguage = async (lng) => {
    try {
        if (typeof i18n?.changeLanguage === 'function') {
            await i18n.changeLanguage(lng)
            // Persist the chosen language for future sessions
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('i18nLng', lng)
            }
        }
    } catch (err) {
        console.error('i18n setLanguage failed', err)
    }
}

export default i18n
