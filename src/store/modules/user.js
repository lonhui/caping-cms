import Cookies from 'js-cookie'
import { login, getInfo, getVerityCode, getUserMenus } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: Cookies.get('name') || '',
    avatar: '',
    roles: [],
    allowed_menus: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
      Cookies.set('name', name)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ALLOWED_MENUS: (state, routes) => {
      state.allowed_menus = routes
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const account = userInfo.account.trim()
      return new Promise((resolve, reject) => {
        login(account, userInfo.password, userInfo.code)
          .then(response => {
            const data = response.data
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            commit('SET_NAME', account)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data
            commit('SET_ROLES', data.roles)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户菜单列表
    GetUserMenus({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserMenus()
          .then(response => {
            const data = response.data
            commit('SET_ALLOWED_MENUS', data)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 获取验证码
    async GetVerityCode() {
      const resp = await getVerityCode()
      console.info(resp)
    }
  }
}

export default user
