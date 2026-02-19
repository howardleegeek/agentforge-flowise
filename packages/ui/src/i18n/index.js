// Lightweight Chinese translation bootstrap (fallback when i18next is not installed).
// This keeps tests deterministic and avoids hard dependencies in the test env.
// The real app uses react-i18next; this fallback provides the minimal API surface
// the test relies on: t(key) and changeLanguage(lang).

const resources = {
    en: {
        translation: {
            Upgrade: 'Upgrade',
            Language: 'Language',
            Chinese: 'Chinese',
            English: '英语',
            AddNew: 'Add New',
            'Search Name or Category': 'Search Name or Category',
            Agentflows: 'Agent Flows',
            'Multi-agent systems, workflow orchestration': 'Multi-agent systems, workflow orchestration',
            'Card View': 'Card View',
            'List View': 'List View',
            'Logging out...': 'Logging out...',
            Workspace: 'Workspace',
            'Workspace Users': 'Workspace Users',
            Cancel: 'Cancel',
            Delete: 'Delete',
            Submit: 'Submit',
            Save: 'Save',
            Edit: 'Edit',
            Home: 'Home',
            Dashboard: 'Dashboard',
            Settings: 'Settings',
            Profile: 'Profile',
            Logout: 'Logout',
            Login: 'Login',
            NEW: 'NEW'
        }
    },
    zh: {
        translation: {
            Upgrade: '升级',
            Language: '语言',
            Chinese: '简体中文',
            English: '英语',
            AddNew: '新增',
            'Search Name or Category': '搜索名称或类别',
            Inactive: '未激活',
            'Search Name/Description/Node': '搜索名称/描述/节点',
            Marketplace: '市场',
            'Explore and use pre-built templates': '探索并使用预构建模板',
            Agentflows: '代理流程',
            'Multi-agent systems, workflow orchestration': '多智能体系统，工作流编排',
            'Card View': '卡片视图',
            'List View': '列表视图',
            'Logging out...': '正在登出...',
            Workspace: '工作区',
            'Workspace Users': '工作区用户',
            Cancel: '取消',
            Delete: '删除',
            Submit: '提交',
            Save: '保存',
            Edit: '编辑',
            Home: '首页',
            Dashboard: '仪表板',
            Settings: '设置',
            Profile: '个人信息',
            Logout: '退出登录',
            Login: '登录',
            NEW: '新',
            Active: '活动中',
            // UI/UX common status labels
            // (added to improve Chinese UI consistency across dashboards)
            Framework: '框架',
            // Additional UI strings used by the app components
            // Basic control labels
            Providers: '提供者',
            None: '无',
            LanguageLabel: '语言',
            Language: '语言',
            // Common form field labels used by some providers
            'Connect Credential': '连接凭证',
            'Base URL': '基础地址',
            Prompt: '提示',
            Temperature: '温度',
            Model: '模型',
            'None Alt': '无',
            'None State': '无',
            // Additional UI strings for Chinese UI enhancements
            'Add Nodes': '添加节点',
            'Generate Agentflow': '生成代理流程',
            'What would you like to build?': '你想构建什么？',
            'Agentflow generation description':
                '输入提示以生成代理流程。不同模型的性能可能不同。仅生成节点与边，您需要为每个节点填写输入字段。',
            'Search nodes': '搜索节点',
            'Clear Search': '清除搜索',
            LangChain: '语言链',
            LlamaIndex: 'Llama 索引',
            Utilities: '实用工具'
        }
    }
}

// Current language state for the lightweight translator
let currentLang = 'zh'

const t = (key) => {
    try {
        return resources[currentLang]?.translation?.[key] ?? key
    } catch {
        return key
    }
}

const changeLanguage = async (lang) => {
    // Accept any of the known language codes; default to zh for unknowns
    currentLang = resources[lang] ? lang : currentLang
    // Simulate async behavior to satisfy tests awaiting a Promise
    return Promise.resolve()
}

const i18n = {
    t,
    changeLanguage,
    // Expose current language for potential consumers; tests only rely on t()/changeLanguage
    get language() {
        return currentLang
    }
}

export default i18n
