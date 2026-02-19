import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Simple in-file translations to bootstrap Chinese support.
// Keys map to common UI strings used across the app. The default language is Chinese.
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
            English: 'English',
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
            Framework: '框架'
        }
    }
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'zh', // default to Chinese
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    react: {
        useSuspense: false
    }
})

export default i18n
