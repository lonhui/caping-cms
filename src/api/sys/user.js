import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data
  })
}

export function bindApp(data) {
  return request({
    url: '/sys/bind/app',
    method: 'post',
    data
  })
}

export function assignRole(data) {
  return request({
    url: '/sys/bind/role',
    method: 'post',
    data
  })
}
