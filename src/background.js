'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const os = require('os')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
// 子进程名称
let workerProcess
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
var count = 0
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
const appPath = path.resolve(__dirname, '..')
// const appPath = process.cwd()
var flag = false
ipcMain.on('connect', (event, arg) => {
  console.log(arg)
  // const str = app.getAppPath()
  // const filePath = path.join('build', 'frp', 'frpc.ini')
  // 开发路径与打包路径不一致
  // const filePath = path.join(__static, 'frp')
  var filePath = ''
  const type = os.type()
  switch (type) {
    case 'Darwin':
    case 'Linux':
      filePath = path.join(appPath, 'frp', 'frp_mac', 'frpc.ini')
      break
    case 'Windows_NT':
      filePath = path.join(appPath, 'frp', 'frp_win', 'frpc.ini')
      break
  }
  const writeString = `
    [common]
    server_addr = 111.229.133.9
    server_port = 7000
    admin_addr = 127.0.0.1
    admin_port = 7400
    [${Math.floor(Math.random() * 100000)}]
    type = tcp
    local_ip = ${arg.ip}
    local_port = ${arg.port}
    remote_port = ${arg.remotePort}
    `
  console.log(writeString)
  console.log(filePath)
  event.sender.send('mes', filePath)
  fs.writeFile(filePath, writeString, function (error) {
    if (error) {
      console.log('写入失败')
      event.sender.send('mes', '写入失败')
    } else {
      console.log('写入成功了')
      event.sender.send('mes', '写入成功了')
      runExec(event)
    }
  })
})
ipcMain.on('close', (event, arg) => {
  close()
  event.sender.send('close', count)
})
function close () {
  if (workerProcess) {
    // exec(str, {})
    // workerProcess.kill()
    const type = os.type()
    const appPath = path.resolve(__dirname, '..')
    var filePath = ''
    switch (type) {
      case 'Darwin':
      case 'Linux':
        filePath = path.join(appPath, 'frp', 'frp_mac')
        workerProcess = exec('frpc --reload', {
          cwd: filePath
        })
        break
      case 'Windows_NT':
        // shellAction(`cd  ${filePath}`)
        filePath = path.join(appPath, 'frp', 'frp_win')
        workerProcess = exec('frps.exe --reload', {
          cwd: filePath
        })
        break
    }
    // switch (type) {
    //   case 'Darwin':
    //   case 'Linux':
    //     exec('ps -ef|grep frp', function (err, stdout, stderr) {
    //       if (err) { return console.log(err) }
    //       stdout.split('\n').filter(function (line) {
    //         var p = line.trim().split(/\s+/)
    //         console.log(p)
    //         var address = p[1]
    //         console.log(address)
    //         if (address !== undefined && address !== 'PID' && p.some((item) => {
    //           return item === './frpc.ini'
    //         })) {
    //           exec('kill ' + address, function (err, stdout, stderr) {
    //             if (err) {
    //               return console.log('杀死进程失败！！')
    //             }
    //             console.log('杀死进程')
    //           })
    //         }
    //       })
    //     })
    //     break
    //   case 'Windows_NT':
    //     // exec('taskkill /f /im frpc.exe')
    //     // exec('taskkill /f /im frpc.exe')
    //     // filePath = path.join(appPath, 'frp', 'frp_win')
    //     // console.log(filePath)
    //     workerProcess = exec('frpc.exe reload', {
    //       cwd: filePath
    //     })
    //     // 打印正常的后台可执行程序输出
    //     workerProcess.stdout.on('data', function (data) {
    //       console.log('stdout: ' + data)
    //     })

    //     // 打印错误的后台可执行程序输出
    //     workerProcess.stderr.on('data', function (data) {
    //       console.log('stderr: ' + data)
    //     })

    //     // 退出之后的输出
    //     workerProcess.on('close', function (code) {
    //       console.log('out code：' + code)
    //     })
    //     break
    // }
  }
}
async function runExec (event) {
  close()
  count = 0
  // const str = app.getAppPath()
  // const filePath = path.join('build', 'frp')
  // const filePath = path.join(__static, 'frp')
  // 开发路径与打包路径不一致
  // const appPath = path.resolve(__dirname, '..')
  // const filePath = path.join(appPath, 'frp')
  // const appPath = path.resolve(__dirname, '..')
  // const appPath = process.cwd()
  // var filePath = ''
  // const type = os.type()
  // switch (type) {
  //   case 'Darwin':
  //   case 'Linux':
  //     filePath = path.join(appPath, 'frp', 'frp_mac', 'frpc.ini')
  //     break
  //   case 'Windows_NT':
  //     filePath = path.join(appPath, 'frp', 'frp_win', 'frpc.ini')
  //     break
  // }
  // event.sender.send('mes', filePath)
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  const type = os.type()
  const appPath = path.resolve(__dirname, '..')
  var filePath = ''
  switch (type) {
    case 'Darwin':
    case 'Linux':
      filePath = path.join(appPath, 'frp', 'frp_mac')
      workerProcess = exec(`cd  ${filePath}
    ./frpc -c reload  ./frpc.ini
    `, {})
      break
    case 'Windows_NT':
      // shellAction(`cd  ${filePath}`)
      filePath = path.join(appPath, 'frp', 'frp_win')
      console.log(filePath)
      if (flag) {
        workerProcess = exec('frpc.exe reload', {
          cwd: filePath
        })
      } else {
        workerProcess = exec('frpc.exe', {
          cwd: filePath
        })
      }
      break
  }
  flag = true
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data)
    event.sender.send('mes', data)
    if (data.includes('proxy success') || data.includes('reload success')) {
      event.sender.send('ok', count)
      count = count++
    } else if (data.includes('already used')) {
      event.sender.send('used')
    } else if (data.includes('W')) {
      // event.sender.send('warning')
    }
  })

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
    event.sender.send('mes', data)
  })

  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('out code：' + code)
    event.sender.send('mes', code)
  })
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 420,
    height: 320,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  close()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
