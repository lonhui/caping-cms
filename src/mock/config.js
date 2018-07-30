import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: '@increment',
      app_id: '@integer(300, 5000)',
      config_key: '@word',
      config_value: '@word',
      config_comment: '@title(5, 20)',
      status: '@integer(0, 1)'
    })
  )
}

export default {
  getList: config => {
    const { page = 1, limit = 20 } = JSON.parse(config.body)
    const pageList = List.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    )
    return {
      code: 0,
      message: '',
      data: {
        total: count,
        configList: pageList
      }
    }
  },
  create: () => ({
    code: 0,
    message: ''
  }),
  update: () => ({
    code: 0,
    message: ''
  })
}
