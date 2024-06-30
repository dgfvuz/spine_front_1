<template>
  <div class="patients">
    <div id="patientsHeader">
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="nameFilter" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="ageFilter" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="genderFilter"
            placeholder="请选择性别"
            style="width: 70px"
          >
            <el-option
              v-for="item in ['男', '女']"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="regionFilter" placeholder="请输入地区"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addressFilter" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleVisiable">新建</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleSearch">搜索</el-button>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button type="default" @click="handlePrevious">上一页</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="handleNext">下一页</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div id="patientsList">
      <el-table :data="patients" stripe height="100%" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column
          prop="name"
          label="姓名"
          width="80"
          fixed
        ></el-table-column>
        <el-table-column prop="age" label="年龄" width="60"></el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="region"
          label="地区"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="id_card"
          label="身份证"
          width="170"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="right">
          <template #header>
            <el-dropdown>
            <span class="el-dropdown-link">
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleBatchDeleteAlert"
                  >删除用户</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          </template>
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="Are you sure to delete this?"
              @confirm="handleDelete(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新建患者"
      v-model="createDialogVisible"
      width="800px"
      >
      <el-form label-position="right" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="newPatient.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="newPatient.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="newPatient.gender" placeholder="请选择性别">
            <el-option
              v-for="item in ['男', '女']"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="newPatient.region" placeholder="请输入地区"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="newPatient.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="newPatient.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="newPatient.id_card" placeholder="请输入身份证"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate">新建</el-button>
          <el-button @click="createDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
    title="编辑患者"
    v-model="editPatientDialogVisible"
    width="800px"
    >
    <el-form label-position="right" label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="editPatient.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="editPatient.age" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="editPatient.gender" placeholder="请选择性别">
          <el-option
            v-for="item in ['男', '女']"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="editPatient.region" placeholder="请输入地区"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="editPatient.address" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="editPatient.phone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="editPatient.id_card" placeholder="请输入身份证"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdatePatient">更改</el-button>
        <el-button @click="editPatientDialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElDescriptions } from "element-plus";
import { Calendar, Search } from "@element-plus/icons-vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { ElTable } from "element-plus";
import axiosInstance from "@/http";
import { ElMessage,ElMessageBox } from "element-plus";
const newPatient = ref({
  name: "",
  age: "",
  region: "",
  address: "",
  phone: "",
  id_card:"",
  gender: "",
});
const editPatient = ref({
  id: 0,
  name: "",
  age: "",
  region: "",
  address: "",
  phone: "",
  id_card:"",
  gender: "",
});
const editPatientDialogVisible = ref(false);
const nameFilter = ref("");
const ageFilter = ref("");
const genderFilter = ref("");
const regionFilter = ref("");
const addressFilter = ref("");
const patients = ref([]);
const next = ref("");
const previous = ref("");
const selectedRows = ref([]);
const createDialogVisible = ref(false);
const handleCreate = async () => {
  try {
    const response = await axiosInstance.post("/patient/create/", newPatient.value);
    ElMessage({
      message: "新建成功",
      type: "success",
    });
    createDialogVisible.value = false;
    fetchPatients("");
  } catch (e) {
    ElMessage({
      message: "新建失败",
      type: "error",
    });
    console.error(e);
  }
};
const handleVisiable = () => {
  createDialogVisible.value = true;
};
const handleEdit = (index: number, row: any) => {
  console.log("edit", index, row);
  editPatient.value = row;
  editPatientDialogVisible.value = true;
};
const handleDelete = async (index: number, row: any) => {
  try {
    const response = await axiosInstance.delete(`/patient/detail/${row.id}/`);
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    // 从列表中删除
    patients.value.splice(index, 1);
  } catch (e) {
    ElMessage({
      message: "删除失败",
      type: "error",
    });
    console.error(e);
  }
};
const fetchPatients = async (path: string) => {
  try {
    if (path === "") {
      path = "/patient/list/";
    }
    const response = await axiosInstance.get(path);
    patients.value = response.data.results;
    // 去掉next的前面的ip和端口部分
    // 判断next是否位NULL
    if (response.data.next === null) {
      next.value = "";
    } else {
      const url = new URL(response.data.next);
      next.value = url.pathname + url.search;
    }
    if (response.data.previous === null) {
      previous.value = "";
    } else {
      const url = new URL(response.data.previous);
      previous.value = url.pathname + url.search;
    }
    ElMessage({
      message: "获取成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: "获取失败",
      type: "error",
    });
    console.error(e);
  }
};
fetchPatients("");
const handleNext = async () => {
  if (next.value === "") {
    ElMessage({
      message: "没有下一页了",
      type: "warning",
    });
    return;
  } else {
    fetchPatients(next.value);
  }
};
const handlePrevious = async () => {
  if (previous.value === "") {
    ElMessage({
      message: "没有上一页了",
      type: "warning",
    });
    return;
  } else {
    fetchPatients(previous.value);
  }
};
const handleSelectionChange = (val: any) => {
  selectedRows.value = val;
  console.log(selectedRows.value);
};
const handleBatchDelete = async () => {
  for (let i = 0; i < selectedRows.value.length; i++) {
    try {
      const response = await axiosInstance.delete(
        `/patient/detail/${selectedRows.value[i].id}/`
      );
      ElMessage({
        message: "成功删除" + selectedRows.value[i].name,
        type: "success",
      });
    } catch (e) {
      ElMessage({
        message: "删除失败",
        type: "error",
      });
      console.error(e);
    }
  }
  fetchPatients("");
};

const handleBatchDeleteAlert = () =>{
  ElMessageBox.confirm('此操作将永久删除选中患者, 是否继续?', '提示', {
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
const handleSearch = async()=>{
  var params = {}
  if(nameFilter.value != ""){
    params["name"] = nameFilter.value;
  }
  if(ageFilter.value != ""){
    params["age"] = ageFilter.value;
  }
  if (genderFilter.value != ""){
    params["gender"] = genderFilter.value;
  }
  if (regionFilter.value != ""){
    params["region"] = regionFilter.value;
  }
  if (addressFilter.value != ""){
    params["address"] = addressFilter.value;
  }
  try{
    const response = await axiosInstance.get('/patient/list/',{
    params:params}
    );
    patients.value = response.data.results;
    if (response.data.next === null) {
      next.value = "";
    } else {
      const url = new URL(response.data.next);
      next.value = url.pathname + url.search;
    }
    if (response.data.previous === null) {
      previous.value = "";
    } else {
      const url = new URL(response.data.previous);
      previous.value = url.pathname + url.search;
    }
    ElMessage({
      message: "搜索成功",
      type: "success",
    });
  }catch(e){
    ElMessage({
      message: "搜索失败",
      type: "error",
    });
    console.error(e);
  }
}
const handleUpdatePatient = async () => {
  try {
    const response = await axiosInstance.patch(`/patient/detail/${editPatient.value.id}/`, editPatient.value);
    ElMessage({
      message: "更新成功",
      type: "success",
    });
    editPatientDialogVisible.value = false;
    fetchPatients("");
  } catch (e) {
    ElMessage({
      message: "更新失败",
      type: "error",
    });
    console.error(e);
  }
};
</script>

<style>
.patients {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
#patientsList {
  flex: 1;
  overflow: auto;
  padding: 10px;
}
#patientsHeader {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
