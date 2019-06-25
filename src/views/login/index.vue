<template>
  <div class="login-wrap">
    <!-- 给组件加class 会把这个class会把这个class作用到组件的根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="@/assets/logo_index.png" alt="黑马头条号">
      </div>
      <!-- 
        配置校验规则
        rules 规则对象配置到el-form上
        prop 校验字段配置到 el-form-item 上
        JavaScript 触发验证
        给 el-form 添加 ref
        ref
        调用 this.$refs['ref名字'].validate(valid => {

        })
       -->
      <el-form class="form-content" ref="form" :model="form" :rules="rules">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
            <el-button @click="handleSendCode" :disabled="!!codeTimer">{{ codeTimer ? `剩余${codetimeSeconds}秒` : '获取验证码' }}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model= "form.agree"></el-checkbox>
          <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import "@/vendor/gt"; //引入极验 JavaScript SDK 文件，通过window.initGeetest 使用
const initCodeTimeSeconds = 10
export default {
  name: "AppLogin",
  data() {
    return {
      form: {
        mobile: '',
        code: '',
        agree: ''
      },
      rules: {
        mobile: [
           { required: true, message: '请输入手机号', trigger: 'blur' },
           { len: 11, min: 3, max: 5, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, min: 3, max: 5, message: '验证码不正确', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议'},
          { pattern: /true/, message: '请同意用户协议'}
        ],
      },
      codeTimer: null,//倒计时定时器
      codetimeSeconds: initCodeTimeSeconds//倒计时事件
    }
  },
  methods: {
    handleLogin () {
      // const { mobile, code } = this.form
      //使用form组件的validate方法触发校验
      this.$refs['form'].validate(valid => {
        if(!valid){
          return
        }
        //表单验证通过，提交登陆请求
        this.submitLogin()
      }) 
    },
    submitLogin(){
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        console.log(res.data)
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      })
      //使用element ui 的提示组件
      .catch((e) =>{
         this.$message.error('登陆失败，手机号或者验证码错误')
      })
    },
    handleSendCode () {
      this.$refs['form'].validateField('mobile', errorMessage =>{
        if(errorMessage.trim().length > 0){
          return
        }
        this.showGeetest()
        //初始化验证码
      })
      // this.$refs['form'].validateField('mobile',errorMessage =>{
      //   console.log(errorMessage);
      // })
    },
    /*验证通过，初始化显示人机交互验证码*/
    // 函数中的function 内部的this 指向 window
    showGeetest () {
      const { mobile } = this.form
      axios({
        method: "GET",
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest({
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' //隐藏，直接弹出极验提供的参数
          },
          function (captchaObj) {
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.onReady (()=> {
                //验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify()//弹出验证码内容框
              }).onSuccess (()=> {//当用户输入合格的手机号码成功
                //your code
                  const { geetest_challenge: challenge, geetest_seccode: seccode, geetest_validate: validate } = captchaObj.getValidate()
                axios({
                  method:'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge,
                    validate,
                    seccode
                  }
                }).then(res => {
                  // 发送短信成功 开始倒计时
                    // this.codeCountDown();
                })
              }).onError(function () {//当用户输入的手机号不合格
                //your code
              })
              //在这里初测”发送验证码“ 按钮的点击事件，验证用户是否输入手机号以及手机号是否有效，正确之后没有问题再去调用
              //captchObj.verify
          }
        )
      })
    },
    /*验证码倒计时*/
    codeCountDown() {
      this.codeTimer = window.setInterval(() => {
        this.codetimeSeconds--
        if(this.codetimeSeconds <= 0){
          //清除定时器
          window.clearInterval(this.codeTimer)
          this.codetimeSeconds = initCodeTimeSeconds//让倒计时的事件回归初始状态
          this.codeTimer = null//定时器结束必须手动将codeTimer赋值为null
        }
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>

  
.login-wrap {
  background: url('login_bg.jpg') no-repeat;
  height: 100%;
  // background-color: skyblue;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 450px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
