import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'zh',
    appConfigId: undefined,
    // 广告
    adv: undefined,
    // 草稿新闻
    draftNewsId: undefined,
    // 新闻频道
    channelList: undefined,
    newsId: undefined
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_APPCONFIGID: (state, appConfigId) => {
      state.appConfigId = appConfigId
    },
    SET_ADV: (state, adv) => {
      state.adv = adv
    },
    SET_DRAFT_NEWS_ID: (state, draftNewsId) => {
      state.draftNewsId = draftNewsId
    },
    SET_CHANNEL_LIST: (state, channelList) => {
      state.channelList = channelList
    },
    SET_NEWS_ID: (state, id) => {
      state.newsId = id
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setAppConfigId({ commit }, appConfigId) {
      commit('SET_APPCONFIGID', appConfigId)
    },
    setAdv({ commit }, adv) {
      commit('SET_ADV', adv)
    },
    setDraftNewsId({ commit }, draftNewsId) {
      commit('SET_DRAFT_NEWS_ID', draftNewsId)
    },
    setChannelList({ commit }, channelList) {
      commit('SET_CHANNEL_LIST', channelList)
    },
    setNewsId({ commit }, id) {
      commit('SET_NEWS_ID', id)
    }
  }
}

export default app
