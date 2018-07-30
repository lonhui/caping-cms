import request from '@/utils/request'

export function fetchDraftsList(data) {
  return request({
    url: '/news/drafts/list',
    method: 'post',
    data
  })
}
export function fetchNewsList(data) {
  return request({
    url: '/news/list',
    method: 'post',
    data
  })
}
export function fetchChannelList() {
  return request({
    url: '/channel/list',
    method: 'get'
  })
}
export function deleteDraft(id) {
  return request({
    url: '/news/drafts/del/' + id,
    method: 'get'
  })
}
export function saveDraft(data) {
  return request({
    url: '/news/drafts/save',
    method: 'post',
    data
  })
}
export function getNewsInfo(id) {
  if (id === undefined) {
    return
  }
  return request({
    url: '/news/info/' + id,
    method: 'get'
  })
}
export function getDraftNewsInfo(id) {
  return request({
    url: '/news/drafts/info/' + id,
    method: 'get'
  })
}
export function publishNews(data) {
  return request({
    url: '/news/publish',
    method: 'post',
    data
  })
}
export function saveNews(data) {
  return request({
    url: '/news/save',
    method: 'post',
    data
  })
}
export function deleteNews(id) {
  return request({
    url: '/news/offline/' + id,
    method: 'get'
  })
}
