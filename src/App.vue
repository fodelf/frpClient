<template>
  <div id="app">
    <div id="heard">
      <span>吴文周内网穿透客户端</span>
    </div>
    <el-form
      v-show="ishow"
      :model="form"
      size="mini"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="content"
    >
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" style="width:100%">
          <el-option :label="'TCP'" :value="'tcp'"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="本地IP" prop="ip">
        <el-input v-model="form.ip" placeholder="IPv4"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="本地端口" prop="port">
            <el-input v-model="form.port" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="远程端口" prop="remotePort">
            <el-input v-model="form.remotePort" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="!ishow" size="mini" label-width="100px" class="content">
      <el-form-item label="远程IP">
        <el-input v-model="ipshow">
          <el-button
            size="mini"
            v-clipboard:copy="ipshow"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            slot="append"
            icon="el-icon-document-copy"
          >
            复制
          </el-button>
        </el-input>
      </el-form-item>
          <el-form-item label="远程网址">
            <el-input v-model="address">
              <el-button
            size="mini"
            v-clipboard:copy="address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            slot="append"
            icon="el-icon-document-copy"
          >
            复制
          </el-button>
            </el-input>
          </el-form-item>
    </el-form>
    <div class="submit">
      <el-button
        size="mini"
        v-show="ishow"
        type="primary"
        @click="connect('ruleForm')"
        >连接</el-button
      >
      <el-button size="mini" v-show="!ishow" type="danger" @click="back()"
        >修改配置</el-button
      >
      <!-- <el-button size="mini" type="danger" @click="breack()"
        >强制断开</el-button
      > -->
      <!-- <el-button size="mini" v-show="!ishow" type="danger" @click="breack()"
        >断开</el-button
      >
      <el-button size="mini" type="danger" @click="breack()"
        >强制断开</el-button
      > -->
    </div>
    <div class="footer">程序退出后超时会自动断开连接</div>
     <!-- <div class="footer">请勿触犯国家法律与社会道德</div> -->
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  data () {
    var validip = (rule, value, callback) => {
      var reg = /^((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))$/
      if (!value) {
        return callback(new Error('IP不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('IP不合法'))
      } else {
        callback()
      }
    }
    var validport = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('端口不能为空'))
      } else if (
        (typeof value * 1 !== 'number' && isNaN(value * 1)) ||
        value < 1 || value > 65535
      ) {
        callback(new Error('范围1-65535'))
      } else {
        callback()
      }
    }
    return {
      ishow: true,
      isChange: false,
      form: {
        ip: '',
        port: '',
        remotePort: '',
        type: 'tcp',
        isChange: false
      },
      rules: {
        ip: [{ validator: validip, trigger: 'blur' }],
        port: [{ validator: validport, trigger: 'blur' }],
        remotePort: [{ validator: validport, trigger: 'blur' }]
      }
    }
  },
  methods: {
    back () {
      this.ishow = true
    },
    connect () {
      this.$refs.form.validate(valid => {
        if (valid) {
          ipcRenderer.send('connect', this.form)
        } else {
          return false
        }
      })
    },
    breack () {
      ipcRenderer.send('close')
    },
    onCopy (e) {
      this.$message({
        message: '复制成功！',
        type: 'success',
        showClose: true
      })
    },
    onError (e) {
      this.$message({
        message: '复制失败！',
        type: 'warning',
        showClose: true
      })
    }
  },
  computed: {
    ipshow () {
      return '111.229.133.9:' + this.form.remotePort
    },
    address () {
      return 'http://www.wuwenzhou.com.cn:' + this.form.remotePort
    }
  },
  created () {
    ipcRenderer.on('ok', (e, arg) => {
      if (arg === 0) {
        this.ishow = false
        this.form.isChange = true
      }
    })
    ipcRenderer.on('close', (e, arg) => {
      this.$message({
        message: '服务已经断开',
        type: 'success',
        showClose: true
      })
      this.ishow = true
    })
    ipcRenderer.on('used', (e, arg) => {
      this.$message({
        message: '外网隐射端口已经被占用请重新填写',
        type: 'warning',
        showClose: true
      })
    })
    ipcRenderer.on('warning', (e, arg) => {
      this.$message({
        message: '服务异常请使用其他端口连接',
        type: 'warning',
        showClose: true
      })
    })
    // ipcRenderer.on('mes', (e, arg) => {
    //   this.$message({
    //     message: arg,
    //     type: 'warning',
    //     showClose: true
    //   })
    // })
  }
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  #heard {
    height: 40px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
    color: #000;
  }
  .content {
    padding-right: 20px;
    box-sizing: border-box;
    height: 138px;
    .submit {
      display: flex;
      justify-content: center;
    }
  }
  .footer {
    margin-top: 10px;
    // position: fixed;
    bottom: 10px;
    width: 100%;
    font-size: 14px;
    text-align: center;
    color: gray;
  }
}
</style>
