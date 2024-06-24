<template>
  <div class="infomation">
    <h1 class="head">账号信息</h1>
    <div class="updateForm">
      <div class="account">
        <div class="item">
          <label for="account">账号:</label>
          <input v-model="form.account" id="account" type="text" disabled />
        </div>
        <div class="item">
          <label for="name">名称:</label>
          <input v-model="form.name" id="name" type="text" />
        </div>
        <div class="item">
          <label for="email">邮箱:</label>
          <input v-model="form.email" id="email" type="email" />
        </div>
      </div>
      <div class="avatar">
        <label for="avatar">头像:</label>
        <img
          :src="form.avatar"
          alt="Avatar"
          v-if="form.avatar"
          class="avatarimg"
        />
        <ImageUpload />
      </div>
      <div class="item">
        <label for="is_active">活跃状态:</label>
        <input
          v-model="form.is_active"
          id="is_active"
          type="checkbox"
          disabled
        />
      </div>
      <div class="item">
        <label for="is_staff">员工:</label>
        <input v-model="form.is_staff" id="is_staff" type="checkbox" disabled />
      </div>
      <div class="item">
        <label for="is_superuser">超级用户:</label>
        <input
          v-model="form.is_superuser"
          id="is_superuser"
          type="checkbox"
          disabled
        />
      </div>
      <div id="meDescription">
        <label for="description">描述:</label>
        <textarea
          v-model="form.description"
          id="description"
          class="discriptionText"
        ></textarea>
      </div>

      <button type="submit" @click="saveChanges" class="submitButton">
        保存
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { reactive } from "vue";
import axiosInstance from "@/http";
import { ref } from "vue";
import ImageUpload from "@/components/ImageUpload.vue";
import { onMounted } from "vue";
import {ElMessage} from "element-plus";

var form;

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
  console.log("fetchUser");
  console.log(useUserStore().user.avatar);
  console.log(response.data);
};
const updateUser = async () => {
  var data;
  if (form.name) {
    data = {
      name: form.name,
      email: form.email,
      description: form.description,
      is_active: form.is_active,
      is_staff: form.is_staff,
      is_superuser: form.is_superuser,
    };
  } else {
    data = {
      email: form.email,
      description: form.description,
      is_active: form.is_active,
      is_staff: form.is_staff,
      is_superuser: form.is_superuser,
    };
  }
  try {
    const response = await axiosInstance.patch(
      "/user/users/" + useUserStore().user.account + "/",
      data
    );
    if (response.status == 200) {
      ElMessage({
        message: "更新成功",
        type: "success",
      })
      console.log("updateUser success");
    } else {
      ElMessage({
        message: response.data.msg,
        type: "error",
      })
      console.log("updateUser failed");
    }
  } catch (e) {
    ElMessage({
      message: "更新失败",
      type: "error",
    })
    console.log(e);
  }
};

fetchUser();
// 将用户信息复制一份存储在 form 变量中
const user = useUserStore().user;
form = user;

const saveChanges = () => {
  updateUser();
  console.log("saveChanges");
  // 重新加载这个页面,刷新页面
  fetchUser();
  form = useUserStore().user;
};
</script>

<style scoped>
/* 样式内容 */
.infomation {
  /* 占满父容器 */
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.updateForm {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.item {
  align-items: center;
}

label {
  display: block;
  margin-bottom: 0.5em;
}
.account {
  align-items: center;
  width: 100%;
  grid-column: 1/3;
}
.avatar {
  /* 居中 */
  width: 100%;
}
.descri {
  grid-column: 1/4;
  width: 100%;
}

.submitButton {
  grid-column: 1/4;
  width: 100%;
  height: 2em;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0.5em;
}
#meDescription {
  width: 100%;
  grid-column: 1/4;
}
.avatarimg {
  /* 设置固定大小 */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  /* 设置不将图像进行形变 */
  object-fit: cover;
}
input,
textarea {
  width: 100%;
  padding: 0.3em;
  box-sizing: border-box;
}
</style>
