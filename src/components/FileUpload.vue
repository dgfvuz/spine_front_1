<template>
    <div>
      <input type="file" @change="handleFileUpload" />
      <button @click="submitFile">上传图片</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { ref } from 'vue'
  import {ElMessage} from "element-plus";
  
  export default {
    setup() {
      const file = ref(null)
  
      function handleFileUpload(event) {
        const uploadedFile = event.target.files[0]
        if (uploadedFile) {
          file.value = uploadedFile
        }
      }
  
      async function submitFile() {
        if (!file.value) {
          alert('请先选择一个文件')
          return
        }
  
        const formData = new FormData()
        formData.append('file', file.value)
  
        try {
          const response = await axios.patch('https://example.com/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          ElMessage({
            message: "上传成功",
            type: "success",
          });
          console.log('文件上传成功:', response.data)
        } catch (error) {
          ElMessage({
            message: "上传失败",
            type: "error",
          });
          console.error('文件上传失败:', error)
        }
      }
  
      return {
        handleFileUpload,
        submitFile
      }
    }
  }
  </script>
  
  <style scoped>
  /* 样式内容 */
  </style>
  