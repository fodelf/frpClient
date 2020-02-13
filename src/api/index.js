/*
 * @Description:首页请求
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2019-06-06 17:35:32
 * @LastEditors  : 吴文周
 * @LastEditTime : 2020-02-10 18:52:01
 */
import request from '../utils/request'
// 地图接口
export function SOLIDER_55 (params) {
  return request({
    url: '/api/connect',
    method: 'POST',
    params: params
  })
}
