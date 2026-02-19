import i18next from 'i18next'

// Minimal i18n instance for tests and runtime without React bindings.
const resources = {
    zh: {
        translation: {
            Language: '语言',
            Providers: '提供者',
            Active: '活动',
            Settings: '设置'
        }
    },
    en: {
        translation: {
            Language: 'Language',
            Providers: 'Providers',
            Active: 'Active',
            Settings: 'Settings'
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
