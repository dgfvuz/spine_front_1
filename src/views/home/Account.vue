<template>
  <div class="securty">
    <el-form>
      <el-form-item>
        <h1>修改密码</h1>
      </el-form-item>
      <el-form-item>
        <el-input v-model="currentPassword" placeholder="当前密码" type="password" required></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="newPassword" placeholder="新密码" type="password" required></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="confirmPassword" placeholder="确认新密码" type="password" required></el-input>
      </el-form-item>
      <el-form-item>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axiosInstance from "@/http";
import { useUserStore } from "@/stores/user";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "新密码和确认密码不匹配";
    return;
  }

  try {
    var response = await axiosInstance.patch(
      "/user/users/" + useUserStore().user.account + "/",
      {
        old_password: currentPassword.value,
        password: newPassword.value,
      }
    );
    errorMessage.value = "";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    if (response.status === 200) {
      ElMessage.success("密码修改成功");
    } else {
      ElMessage.error("密码修改失败");
    }
  } catch (error) {
    ElMessage.error("密码修改失败");
    errorMessage.value = error.response.data.detail;
  }
};
</script>

<style>
.securty {
  /* 右侧滚动条 */
  overflow-y: scroll;
  /* 占满父容器 */
  height: 100%;
  padding: 1em;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
}


</style>
