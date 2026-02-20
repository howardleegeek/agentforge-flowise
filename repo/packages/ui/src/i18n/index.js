const i18n = {
    language: 'zh',
    translations: {
        zh: {
            Language: '语言',
            Providers: '提供者',
            Agents: '智能体',
            'View Messages': '查看消息',
            'Load Chatflow': '加载聊天流程',
            // Workflow related translations (used by workflow builder nodes and UI)
            Workflow: '工作流',
            'Workflow Builder': '工作流构建器',
            'Agent Flows': '代理流程',
            // Alias used by tests
            AgentFlows: '代理流程'
        },
        en: {
            Language: 'Language',
            Providers: 'Providers',
            Agents: 'Agents',
            'View Messages': 'View Messages',
            'Load Chatflow': 'Load Chatflow',
            // Mirror keys for workflow builder (kept as English fallbacks)
            Workflow: 'Workflow',
            'Workflow Builder': 'Workflow Builder',
            'Agent Flows': 'Agent Flows',
            AgentFlows: 'AgentFlows'
        }
    },
    changeLanguage: async function (lang) {
        if (this.translations[lang]) {
            this.language = lang
        } else {
            // Fallback to English if unsupported
            this.language = 'en'
        }
        return lang
    },
    t: function (key) {
        return (this.translations[this.language] && this.translations[this.language][key]) || this.translations.en?.[key] || key
    },
    // Convenience getter for tests/debugging
    get currentLanguage() {
        return this.language
    }
}
export default i18n
