import i18next from 'i18next'

// Minimal i18n instance for tests and runtime without React bindings.
const resources = {
    zh: {
        translation: {
            Language: '语言',
            Providers: '提供者',
            Active: '活动',
            Settings: '设置',
            // Global UI keys commonly used across the app
            Upgrade: '升级',
            Workspaces: '工作区',
            Marketplace: '市场',
            Search: '搜索',
            'Search nodes': '搜索节点',
            'Clear Search': '清除搜索',
            'Add Nodes': '添加节点',
            'What would you like to build?': '你想构建什么？',
            'Agentflow generation description': 'Agentflow 生成描述',
            Chinese: '简体中文',
            English: '英文',
            // Common form / button labels
            Cancel: '取消',
            Save: '保存',
            Delete: '删除',
            Edit: '编辑',
            Users: '用户',
            Last: '最近',
            LastUpdated: '最近更新',
            Name: '名称',
            Description: '描述',
            // Node / workflow builder related keys
            'Chat Models': '聊天模型',
            'Text Splitters': '文本分割器',
            'Document Loaders': '文档加载器',
            Embeddings: '嵌入',
            'Vector Stores': '向量存储',
            'Record Manager': '记录管理',
            Tools: '工具',
            'Tools (MCP)': '工具（MCP）',
            'No Grading': '无评分',
            LangChain: '语言链',
            LlamaIndex: 'Llama 索引',
            AgentFlows: '代理流程',
            'Multi Agents': '多智能体',
            'Sequential Agents': '顺序智能体',
            // Misc
            'Explore and use pre-built templates': '探索并使用预构建模板',
            'Agent Flows': '代理流程'
        }
    },
    en: {
        translation: {
            Language: 'Language',
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
            Marketplace: 'Marketplace',
            'Explore and use pre-built templates': 'Explore and use pre-built templates'
        }
    }
}

const i18n = i18next.createInstance()
i18n.init({
    resources,
    lng: 'zh', // default to Chinese as per specification
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: { escapeValue: false }
}).catch((err) => {
    // Critical path: ensure we log for debugging but do not crash build/tests
    console.error('i18n init failed', err)
})

export default i18n
