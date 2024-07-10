<template>
    <div class="question">
      <h1>问题反馈</h1>
      <p>请在下方输入您的问题或建议，我们会尽快回复您。</p>
      <el-form>
        <el-form-item label="问题标题">
          <el-input type="textarea" :rows="2" placeholder="请输入问题标题" v-model="question.title" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="详细问题">
          <el-input
    v-model="question.body"
    style="width: 600px"
    :rows="6"
    type="textarea"
    placeholder="请输入具体问题"
  />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitQuestion">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import {useUserStore} from '@/stores/user'
import axiosInstance from '@/http'
import {ElMessage}  from 'element-plus'
const question = ref({
  title: '',
  body: '',
})

const onSubmitQuestion = async () => {
  try {
    await axiosInstance.post('/advice/create/', {
      title: question.value.title,
      body: question.value.body,
      user: useUserStore().user.account,
    })
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  }
}
</script>
  <style>
  </style>
  