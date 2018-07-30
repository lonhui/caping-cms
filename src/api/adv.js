import request from '@/utils/request'

export function addAdv(data) {
  return request({
    url: '/adv/add',
    method: 'post',
    data
  })
}
export function fetchList(data) {
  return request({
    url: '/adv/list',
    method: 'post',
    data
  })
}
export function deleteAdv(id) {
  return request({
    url: '/adv/delete/' + id,
    method: 'get'
  })
}
export function disableAdv(id) {
  return request({
    url: 'adv/disable/' + id,
    method: 'get'
  })
}
export function enableAdv(id) {
  return request({
    url: 'adv/enable/' + id,
    method: 'get'
  })
}
export function updateAdv(data) {
  return request({
    url: 'adv/update',
    method: 'post',
    data
  })
}
