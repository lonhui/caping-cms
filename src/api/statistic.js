import request from '@/utils/request'

export function fetchActiveList(data) {
  return request({
    url: '/statistic/active',
    method: 'post',
    data
  })
}

export function fetchRetentionList(data) {
  return request({
    url: '/statistic/relation',
    method: 'post',
    data
  })
}
