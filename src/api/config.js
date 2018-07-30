import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/config/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/config/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/config/update',
    method: 'post',
    data
  })
}
