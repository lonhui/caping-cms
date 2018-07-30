import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/app/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/app/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/app/update',
    method: 'post',
    data
  })
}
