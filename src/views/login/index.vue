<template>
  <div class="login-warp">
    <!-- 给组件加class，会把这个class作用到组件的根元素 -->
    <el-form class="login-form" ref="form" :model="form">
      <el-form-item>
        <el-input v-model="form.mobile" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AppLogin',
  data() {
    return {
      form: {
        mobile: '',
        code: ''
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style lang="less" scoped>
.login-warp {
  height: 100%;
  background-color: #e1f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-from {
  }
}
</style>