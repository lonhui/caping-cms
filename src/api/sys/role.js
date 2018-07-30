import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/sys/role/list',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/sys/role/info',
    method: 'post',
    data
  })
}
