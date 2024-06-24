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
        <el-input v-model="ruleForm.account" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item v-if="is_register" label="确认密码" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item v-if="is_register" label="注册码">
        <el-input v-model="ruleForm.register_code" autocomplete="off" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)" class="login"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import router from "@/router";
import axiosInstance from "@/http";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
const ruleFormRef = ref<FormInstance>();
const is_register = ref(false);

const checkUserName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入用户名"));
  } else {
    if (value.length < 3) {
      return callback(new Error("用户名长度不能小于3位"));
    }
  }
  callback();
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  password: "",
  checkPass: "",
  register_code: "",
  account: "",
});

const rules = reactive<FormRules<typeof ruleForm>>({
  password: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  account: [{ validator: checkUserName, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      loginUser();
    } else {
      console.log("error submit!");
      return false;
    }
  });
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
  console.log("fetchUser");
  console.log(useUserStore().user.avatar);
  console.log(response.data);
};
async function loginUser() {
  try {
    const res = await axiosInstance.post("/user/login/", ruleForm);
    if (res.status === 200) {
      useUserStore().user.name = res.data.name;
      useUserStore().user.token = res.data.token;
      useUserStore().user.account = res.data.account;
      useUserStore().user.refresh = res.data.refresh;
      useUserStore().user.is_logged_in = true;
      useUserStore().user.is_superuser = res.data.is_superuser;
      fetchUser();
      console.log("响应数据");
      console.log(res.data);
      ElMessage({
        message: "登录成功",
        type: "success",
      })
      if (res.data.is_superuser) {
        router.push("/admin/users");
      } else{
        router.push("/home/todo");
      }
    } else {
      ElMessage({
        message: res.data.msg,
        type: "error",
      })
      console.log(res.data.msg);
    }
  } catch (e) {
    ElMessage({
      message: "登录失败",
      type: "error",
    })
    console.log(e);
  }
}
</script>
<style>
.demo-ruleForm {
  margin: 0;
  padding: 20px;
}
.container {
  height: 100vh;
  width: 100vw;
  background-image: url(/background_img.jpg);
  background-size: cover;
  justify-content: center;
  display: flex;
  align-items: center;
  /* 设置背景图片 */
}

.demo-ruleForm {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}
.login {
  width: 100%;
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
