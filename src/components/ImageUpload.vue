<template>
    <div>
      <button @click="triggerFileInput">上传图片</button>
      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none;" />
    </div>
  </template>
  

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { reactive } from "vue";
import axiosInstance from "@/http";
import { ref } from "vue";
var fileInput = ref(null);
var imageFile = ref(null);

function triggerFileInput() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  const uploadedFile = event.target.files[0];
  if (uploadedFile) {
    // 检查文件类型
    if (!["image/jpeg", "image/png", "image/gif"].includes(uploadedFile.type)) {
      alert("Invalid file type. Please upload an image file.");
      return;
    }
    imageFile.value = uploadedFile;
    updateImage();
  }
}

const fetchUser = async () => {
  const response = await axiosInstance.get(
    "/user/users/" + useUserStore().user.account + "/"
  );
  useUserStore().user.name = response.data.name;
  useUserStore().user.email = response.data.email;
  useUserStore().user.description = response.data.description;
  useUserStore().user.is_active = response.data.is_active;
  useUserStore().user.is_staff = response.data.is_staff;
  useUserStore().user.is_superuser = response.data.is_superuser;
  useUserStore().user.avatar = response.data.avatar;
};
const updateImage = async () =>{
    var data = {
      avatar: imageFile.value,
    };
    try {
      const response = await axiosInstance.patch(
        "/user/users/" + useUserStore().user.account + "/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("文件上传成功:", response.data);
      fetchUser();
    } catch (error) {
      console.error("文件上传失败:", error);
    }
}
</script>
  
  <style scoped>
  /* 样式内容 */
  button {
    display: inline-block;
    margin: 10px 0;
    padding: 10px 20px;
    font-size: 10px;
  }

  </style>
  