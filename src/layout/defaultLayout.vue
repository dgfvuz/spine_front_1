<template>
  <div class="default-layout">
    <el-page-header class="header" @back="handleBack" :icon="null">
      <template #title>
        <span class="headerTitle">脊柱侧弯X光系统</span>
      </template>
      <template #content>
        <el-avatar
          :src="
            config.replace
              ? useUserStore().user.avatar.replace(
                  config.transformedUrl,
                  config.apiBaseUrl
                )
              : useUserStore().user.avatar
          "
          class="userAvatar"
        />
        <span class="userName">{{ useUserStore().user.name }}</span>
      </template>
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span>
          更多操作
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="clickUpdate">修改资料</el-dropdown-item>
            <el-dropdown-item @click="clickChangePassword"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click="triggerFileInput"
              >上传头像</el-dropdown-item
            >
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-page-header>
    <div class="rest-content">
      <div class="menuBody">
        <aside class="menu">
          <MenuView />
        </aside>
        <main class="main">
          <div class="body">
            <router-view />
          </div>
        </main>
      </div>
    </div>
    <el-dialog v-model="userFormVisible" title="更改资料" width="800">
      <el-form :model="editFormData">
        <el-form-item label="账号" label-width="120px">
          <el-input
            v-model="editFormData.account"
            placeholder="请输入账号"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px">
          <el-input
            v-model="editFormData.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input
            v-model="editFormData.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <el-input
            v-model="editFormData.description"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否可用" label-width="120px">
          <el-switch v-model="editFormData.is_active" disabled></el-switch>
        </el-form-item>
        <el-form-item label="是否员工" label-width="120px">
          <el-switch v-model="editFormData.is_staff" disabled></el-switch>
        </el-form-item>
        <el-form-item label="是否超级用户" label-width="120px">
          <el-switch v-model="editFormData.is_superuser" disabled></el-switch>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="onEditSubmit">确认</el-button>
        <el-button @click="onEditCancel">Cancel</el-button>
      </el-form-item>
    </el-dialog>
    <el-dialog v-model="passwordFormVisible" title="修改密码" width="400">
      <el-form :model="passwordForm">
        <el-form-item label="旧密码" label-width="120px">
          <el-input
            v-model="passwordForm.old_password"
            placeholder="请输入旧密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px">
          <el-input
            v-model="passwordForm.new_password"
            placeholder="请输入新密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px">
          <el-input
            v-model="passwordForm.confirm_password"
            placeholder="请再次输入新密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="onPasswordSubmit">确认</el-button>
        <el-button @click="onPasswordCancel">Cancel</el-button>
      </el-form-item>
    </el-dialog>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      accept="image/*"
      style="display: none"
    />
  </div>
</template>
<script lang="ts" setup>
import Header from "../components/Header.vue";
import MenuView from "../components/MenuView.vue";
import { RouterView } from "vue-router";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ArrowDown } from "@element-plus/icons-vue";
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElAvatar,
  ElPageHeader,
  ElIcon,
} from "element-plus";
import axiosInstance from "@/http";
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
import { ref } from "vue";
import config from "@/config";
var fileInput = ref(null);
var imageFile = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};
const handleFileUpload = (event) => {
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
};
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
const updateImage = async () => {
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
    fetchUser();
  } catch (error) {
    console.error("文件上传失败:", error);
  }
};
const errorMessage = ref("");
const userFormVisible = ref(false);
const passwordFormVisible = ref(false);
const passwordForm = ref({
  old_password: "",
  new_password: "",
  confirm_password: "",
});
const handleBack = () => {
  router.go(-1);
};

const editFormData = ref({
  account: useUserStore().user.account,
  name: useUserStore().user.name,
  email: useUserStore().user.email,
  description: useUserStore().user.description,
  is_active: useUserStore().user.is_active,
  is_staff: useUserStore().user.is_staff,
  is_superuser: useUserStore().user.is_superuser,
});

const clickUpdate = () => {
  fetchUser();
  editFormData.value = {
    account: useUserStore().user.account,
    name: useUserStore().user.name,
    email: useUserStore().user.email,
    description: useUserStore().user.description,
    is_active: useUserStore().user.is_active,
    is_staff: useUserStore().user.is_staff,
    is_superuser: useUserStore().user.is_superuser,
  };
  userFormVisible.value = true;
};

const clickChangePassword = () => {
  passwordFormVisible.value = true;
};

const onEditSubmit = async () => {
  try {
    const response = await axiosInstance.patch(
      "/user/users/" + editFormData.value.account + "/",
      editFormData.value
    );
    if (response.status === 200) {
      ElMessage({
        message: "更新成功",
        type: "success",
      });
    }
    userFormVisible.value = false;
  } catch (error) {
    ElMessage({
      message: "更新失败",
      type: "error",
    });
    console.error(error);
  }
};
const onEditCancel = () => {
  userFormVisible.value = false;
};
const logout = () => {
  router.push("/login");
};

const onPasswordSubmit = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    errorMessage.value = "新密码和确认密码不匹配";
    return;
  }
  try {
    var response = await axiosInstance.patch(
      "/user/users/" + useUserStore().user.account + "/",
      {
        old_password: passwordForm.value.old_password,
        password: passwordForm.value.new_password,
      }
    );
    errorMessage.value = "";
    passwordForm.value.old_password = "";
    passwordForm.value.new_password = "";
    passwordForm.value.confirm_password = "";
    if (response.status === 200) {
      ElMessage.success("密码修改成功");
    } else {
      ElMessage.error("密码修改失败");
    }
    passwordFormVisible.value = false;
  } catch (error) {
    console.error("changePassword", error);
  }
};
const onPasswordCancel = () => {
  passwordFormVisible.value = false;
};
</script>
<style scoped>
.error {
  color: red;
}
.headerTitle {
  font-size: 1.5em;
}

.default-layout {
  height: 100vh;
  width: 100vw;
}
.menuBody {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.rest-content {
  height: 92%;
  width: 100%;
}
.menu {
  width: 10%;
  background-color: #ffffff;
}
.main {
  width: 80%;
  flex: 1;
}
.body {
  /* 右侧滚动条 */
  /* 占满父容器 */
  height: 100%;
  padding: 1em;
  padding-bottom: 10px;
  width: 100%;
}
.nameAndAvatar {
  display: flex;
  flex-direction: row;
}
.avatarimg {
  height: 50px;
  /* 设置宽度和高度一样大 */
  width: 50px;
  border-radius: 50%;
  /* 靠右 */
  margin-right: 1em;
  object-fit: cover;
}
.content-title {
  height: 100%;
  font-size: 1.5em;
  margin-right: 1em;
  /* 字体竖直居中 */
}
/* 对header_name写样式 */
#header_name {
  margin-right: 1em;
  font-size: 1.5em;
}
.header {
  width: 100%;
  height: 8%;
  padding-right: 1em;
  display: flex;
  justify-content: space-between;
}
.userName {
  font-size: 1em;
  margin-left: 1em;
}
</style>
