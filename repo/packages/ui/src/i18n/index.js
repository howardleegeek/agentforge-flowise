const i18n = {
    language: 'zh',
    translations: {
        zh: {
            Language: '语言',
            Providers: '提供者',
            Agents: '智能体',
            'View Messages': '查看消息',
            'Load Chatflow': '加载聊天流程'
        },
        en: {
            Language: 'Language',
            Providers: 'Providers',
            Agents: 'Agents',
            'View Messages': 'View Messages',
            'Load Chatflow': 'Load Chatflow'
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
