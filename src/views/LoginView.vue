<template>
    <div class="container">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
    <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="is_register" label="确认密码" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >提交</el-button
        >
        <el-button v-if="!is_register" @click="handleRegister">注册</el-button>
        <el-button v-if="is_register" @click="handleRegister">登录</el-button>
      </el-form-item>
    </el-form>
</div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
import router from '@/router';
  
  const ruleFormRef = ref<FormInstance>()
  const is_register = ref(false)

  const checkUserName = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('请输入用户名'))
    }else{
        if (value.length < 3) {
            return callback(new Error('用户名长度不能小于3位'))
        }
    }
    callback()
  }
  
  const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      if (ruleForm.checkPass !== '') {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validateField('checkPass', () => null)
      }
      callback()
    }
  }
  const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.pass) {
      callback(new Error("两次输入密码不一致"))
    } else {
      callback()
    }
  }
  
  const ruleForm = reactive({
    pass: '',
    checkPass: '',
    userName: '',
  })
  
  const rules = reactive<FormRules<typeof ruleForm>>({
    pass: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    userName: [{ validator: checkUserName, trigger: 'blur' }],
  })
  
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('submit!')
        router.push('/home/todo')
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
  
  const handleRegister = () => {
    is_register.value = !is_register.value
  }
  </script>
  <style>
    .demo-ruleForm {
        margin: 0;
        padding: 20px;
    }
    .container{
    height: 100vh;
    width: 100vw;
    background-color: white;
    background-size: cover;
    justify-content: center;
    display: flex;
    align-items: center;
}
    /* .login-view{
        background-image: url(https://n.sinaimg.cn/sinacn01/745/w980h565/20181117/8546-hnyuqhh2236147.png);
        width: 100%;
        height: 100%;
    } */
</style>

<!-- <template>
  <p>hello？</p>
</template> -->