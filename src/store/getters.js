const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  appConfigId: state => state.app.appConfigId,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  allowed_menus: state => state.user.allowed_menus,
  errorLogs: state => state.errorLog.logs,
  adv: state => state.app.adv,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  draftNewsId: state => state.app.draftNewsId,
  channelList: state => state.app.channelList,
  newsId: state => state.app.newsId
}
export default getters
