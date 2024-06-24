<template>
  <div class="userManage">
    <el-table
      :data="filterTableData"
      style="width: 100%"
      border
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="account" width="120">
        <template #header>
          <el-input
            v-model="searchAccount"
            size="small"
            placeholder="搜索账号"
          />
        </template>
        <!-- <template #default="scope">
          <el-avatar :src="scope.row.avatar" size="small" shape="square"></el-avatar>
        </template> -->
      </el-table-column>
      <el-table-column prop="name" width="120">
        <template #header>
          <el-input v-model="searchName" size="small" placeholder="搜索姓名" />
        </template>
        <!-- <template #default="scope">
          <el-avatar :src="scope.row.avatar" size="small" shape="square"></el-avatar>
        </template> -->
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="description"
        label="描述"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="is_active"
        label="是否可用"
        width="100"
        :filters="[
          { text: '是', value: true },
          { text: '否', value: false },
        ]"
        :filter-method="filterIsActive"
      />
      <el-table-column
        prop="is_staff"
        label="是否员工"
        width="100"
        :filters="[
          { text: '是', value: true },
          { text: '否', value: false },
        ]"
        :filter-method="filterIsStaff"
      />
      <el-table-column
        prop="is_superuser"
        label="是否超级用户"
        :filters="[
          { text: '是', value: true },
          { text: '否', value: false },
        ]"
        :filter-method="filterIsSuperuser"
      />

      <el-table-column align="right" width="200">
        <template #header>
          <!-- <el-button  size="small" @click="handleRefresh">
            刷新</el-button> -->
          <el-dropdown>
            <span class="el-dropdown-link">
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleCreate"
                  >创建用户</el-dropdown-item
                >
                <el-dropdown-item @click="handleRefresh"
                  >更新表格</el-dropdown-item
                >
                <el-dropdown-item @click="handleResetPassword"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item @click="handleBatchDeleteAlert"
                  >删除用户</el-dropdown-item
                >
                <el-dropdown-item @click="handleBatchSuperuser"
                  >权限取反</el-dropdown-item
                >
                <el-dropdown-item @click="handleAccountSort"
                  >账号排序</el-dropdown-item
                >
                <el-dropdown-item @click="handleNameSort"
                  >姓名排序</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button
                size="small"
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogTableVisible" title="创建新用户" width="800">
      <el-form :model="formData">
        <el-form-item label="账号" label-width="120px">
          <el-input
            v-model="formData.account"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <el-input
            v-model="formData.description"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否可用" label-width="120px">
          <el-switch v-model="formData.is_active"></el-switch>
        </el-form-item>
        <el-form-item label="是否员工" label-width="120px">
          <el-switch v-model="formData.is_staff"></el-switch>
        </el-form-item>
        <el-form-item label="是否超级用户" label-width="120px">
          <el-switch v-model="formData.is_superuser"></el-switch>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-dialog>
    <el-dialog
      v-model="editUserdialogTableVisible"
      title="编辑用户"
      width="800"
    >
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
          <el-switch v-model="editFormData.is_active"></el-switch>
        </el-form-item>
        <el-form-item label="是否员工" label-width="120px">
          <el-switch v-model="editFormData.is_staff"></el-switch>
        </el-form-item>
        <el-form-item label="是否超级用户" label-width="120px">
          <el-switch v-model="editFormData.is_superuser"></el-switch>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="onEditSubmit">确认</el-button>
        <el-button @click="onEditCancel">Cancel</el-button>
      </el-form-item>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import axiosInstance from "@/http";
import { ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { ElTable } from "element-plus";
import { computed } from "@vue/reactivity";
import { ElNotification, ElMessage,ElMessageBox } from "element-plus";
const tableData = ref([]);
const selectedRows = ref([]);
const editFormData = ref({
  account: "",
  name: "",
  email: "",
  description: "",
  is_active: false,
  is_staff: false,
  is_superuser: false,
});
const formData = ref({
  account: "",
  name: "",
  email: "",
  description: "",
  is_active: false,
  is_staff: false,
  is_superuser: false,
  password: "123456a?",
});
const dialogTableVisible = ref(false);
const editUserdialogTableVisible = ref(false);
const filterTableData = computed(() => {
  return tableData.value.filter((row) => {
    return (
      row.account.includes(searchAccount.value) &&
      row.name.includes(searchName.value)
    );
  });
});

// onMounted(() => {
//     console.log("onMounted");
// })
const fetchData = async () => {
  try {
    const response = await axiosInstance.get("/user/users/");
    tableData.value = response.data;
    ElMessage({
      message: "获取数据成功",
      type: "success",
    });
    console.log("fetchData");
  } catch (error) {
    ElMessage({
      message: "获取数据失败",
      type: "error",
    });
    console.error(error);
  }
};
fetchData();
const searchAccount = ref("");
const searchName = ref("");
const handleEdit = (index: number, row: any) => {
  console.log(index, row);
  // row去掉avatar字段
  delete row.avatar;
  editFormData.value = row;
  editUserdialogTableVisible.value = true;
};
const handleDelete = async (index: number, row: any) => {
  console.log(index, row);
  // 删除用户
  try {
    const response = await axiosInstance.delete(
      "/user/users/" + row.account + "/"
    );
    if (response.status === 204) {
      ElNotification({
        title: "成功",
        message: "删除成功",
        type: "success",
      });
      console.log("删除成功");
    }
  } catch (error) {
    ElNotification({
      title: "错误",
      message: error.message,
      type: "error",
    });
    console.error(error);
  }
  fetchData();
};
const handleRefresh = () => {
  fetchData();
};
const handleCreate = () => {
  dialogTableVisible.value = true;
};
const filterIsActive = (value: any, row: any) => {
  return row.is_active === value;
};
const filterIsStaff = (value: any, row: any) => {
  return row.is_staff === value;
};
const filterIsSuperuser = (value: any, row: any) => {
  return row.is_superuser === value;
};
const onSubmit = async () => {
  try {
    const response = await axiosInstance.post(
      "/user/register/",
      formData.value
    );
    if (response.status === 201) {
      ElMessage({
        message: "创建成功",
        type: "success",
      });
      console.log("创建成功");
    }
    console.log(response);
    fetchData();
    dialogTableVisible.value = false;
  } catch (error) {
    ElMessage({
      message: "创建失败",
      type: "error",
    });
    console.error(error);
  }
};
const onCancel = () => {
  dialogTableVisible.value = false;
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
      console.log("更新成功");
    }
    console.log(response);
    fetchData();
    editUserdialogTableVisible.value = false;
  } catch (error) {
    ElMessage({
      message: "更新失败",
      type: "error",
    });
    console.error(error);
  }
};
const onEditCancel = () => {
  editUserdialogTableVisible.value = false;
};
const handleResetPassword = async () => {
  // 遍历selectedRows
  for (let i = 0; i < selectedRows.value.length; i++) {
    try {
      const response = await axiosInstance.patch(
        "/user/users/" + selectedRows.value[i].account + "/",
        {
          password: "123456a?",
        }
      );
      if (response.status === 200) {
        ElMessage({
          message: "用户" + selectedRows.value[i].account + "重置成功",
          type: "success",
        });
        console.log("重置密码成功");
      }
    } catch (error) {
      ElMessage({
        message: "用户" + selectedRows.value[i].account + "重置失败",
        type: "error",
      });
      console.error(error);
    }
  }
};
const handleSelectionChange = (val: any) => {
  selectedRows.value = val;
  console.log(selectedRows.value);
};
const handleBatchDelete = async () => {
  // 遍历selectedRows
  for (let i = 0; i < selectedRows.value.length; i++) {
    try {
      const response = await axiosInstance.delete(
        "/user/users/" + selectedRows.value[i].account + "/"
      );
      if (response.status === 204) {
        ElMessage({
          message: "用户" + selectedRows.value[i].account + "删除成功",
          type: "success",
        });
        console.log("删除成功");
      }
    } catch (error) {
      ElMessage({
        message: "用户" + selectedRows.value[i].account + "删除失败",
        type: "error",
      });
      console.error(error);
    }
  }
  fetchData();
};
const handleBatchSuperuser = async () => {
  // 遍历selectedRows
  for (let i = 0; i < selectedRows.value.length; i++) {
    try {
      const response = await axiosInstance.patch(
        "/user/users/" + selectedRows.value[i].account + "/",
        {
          is_superuser: !selectedRows.value[i].is_superuser,
        }
      );
      if (response.status === 200) {
        ElMessage({
          message: "用户" + selectedRows.value[i].account + "权限取反成功",
          type: "success",
        });
        console.log("权限取反成功");
      }
    } catch (error) {
      ElMessage({
        message: "用户" + selectedRows.value[i].account + "权限取反失败",
        type: "error",
      });
      console.error(error);
    }
  }
  fetchData();
};
const handleBatchDeleteAlert = () =>{
  ElMessageBox.confirm('此操作将永久删除选中用户, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleBatchDelete();
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
};
const handleAccountSort = () => {
  tableData.value.sort((a, b) => {
    return a.account.localeCompare(b.account);
  });
};
const handleNameSort = () => {
  tableData.value.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};
</script>

<style>
.userManage {
  /* 占满父容器 */
  height: 100%;
  width: 100%;
}
.table {
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}
#pagi {
  height: 5%;
  display: flex;
  /* 靠右展示 */
  justify-content: flex-end;
}
</style>
