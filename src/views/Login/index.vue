<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
import { loginApi } from "@/service/api/login";

const router = useRouter()
const data = reactive({
  loginForm: {
    username: '',
    password: '',
  },
  loginRules: {
    username: [
      { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ],
  }
})
const loginForm = ref()
function login (){
  loginForm.value.validate((valid: any) => {
    if (valid) {
      loginApi(data.loginForm).then(res => {
        if (res.data.code === 1) {
          ElMessage.success('登录成功')
          router.push('/home')
        } else {
          ElMessage.error(res.data.message)
        }
      })
    } else {
      ElMessage.warning('请输入账号和密码')
    }

  })
}
</script>

<template>
  <div class="login-container">
    <div class="system-font">PickPal后台商家管理系统</div>
    <div class="login-box">
      <span>登 录</span>
      <el-form :model="data.loginForm" :rules="data.loginRules" ref="loginForm" size="large">
        <el-form-item prop="username" label="账号" >
          <el-input prefix-icon="User" type="text" v-model="data.loginForm.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input prefix-icon="Lock" type="password" v-model="data.loginForm.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/img/login-bg.jpg");
  background-size: cover;

  .system-font {
    font-family: '鸿雷拙书简体',serif;
    text-align: center;
    font-size: 55px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    transform: translateY(-80px);
  }

  .login-box {
    width: 350px;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.8);

    span {
      display: block;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
}
</style>