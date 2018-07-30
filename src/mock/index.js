import Mock from 'mockjs'
import configAPI from './config'

Mock.mock(/\/config\/list/, 'post', configAPI.getList)
Mock.mock(/\/config\/add/, 'post', configAPI.create)
Mock.mock(/\/config\/update/, 'post', configAPI.update)

export default Mock
