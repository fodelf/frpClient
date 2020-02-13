/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: http://gitlab.yzf.net/wuwenzhou
 * @Date: 2019-11-18 08:40:40
 * @LastEditors  : 吴文周
 * @LastEditTime : 2020-02-10 19:31:25
 */
const express = require('express')
const bodyParser = require('body-parser')
const isPlatformWindows = process.platform.indexOf('win') === 0
const app = express()
/**
 * @name: getList
 * @description: 获取文件列表
 * @param {type}: 默认参数
 * @return {type}: 默认类型
 */
function getList (app) {
  app.post('/api/', (req, res) => {
    const base = req.body.path
  })
}
function API () {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({ limit: '5000000kb' }))
  getList(app)
  app.listen(65535, () => console.log('listening on port 65535!'))
}

module.exports = API
