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
              v-for="item in ['男', '女', '']"
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
        <!-- <el-form-item label="每页条数">
          <el-input
            v-model="defaultPageSize"
            placeholder="请输入每页显示数量"
            type="number"
            ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="default" @click="fetchPatients">搜索</el-button>
        </el-form-item>
        <!-- <div>
          <el-form-item>
            <el-button type="default" @click="handlePrevious">上一页</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="handleNext">下一页</el-button>
          </el-form-item>
        </div> -->
      </el-form>
    </div>
    <div id="patientsList">
      <el-table
        :data="patients"
        stripe
        height="100%"
        style="height: 90%; width: 100%; overflow: auto"
        @selection-change="handleSelectionChange"
      >
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
            <el-button
              size="small"
              @click="handleAddReport(scope.$index, scope.row)"
              >添加报告</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleCollect(scope.$index, scope.row)"
              >收藏</el-button>
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
      <el-pagination
        layout="prev, pager, next"
        :total="total_num"
        :page-size="Number(defaultPageSize)"
        style="height: 10%"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="新建患者" v-model="createDialogVisible" width="800px">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="姓名">
          <el-input
            v-model="newPatient.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            v-model="newPatient.age"
            placeholder="请输入年龄"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="newPatient.gender" placeholder="请选择性别">
            <el-option
              v-for="item in ['男', '女']"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-input
            v-model="newPatient.region"
            placeholder="请输入地区"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            v-model="newPatient.address"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="newPatient.phone"
            placeholder="请输入电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input
            v-model="newPatient.id_card"
            placeholder="请输入身份证"
          ></el-input>
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
          <el-input
            v-model="editPatient.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            v-model="editPatient.age"
            placeholder="请输入年龄"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editPatient.gender" placeholder="请选择性别">
            <el-option
              v-for="item in ['男', '女']"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-input
            v-model="editPatient.region"
            placeholder="请输入地区"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            v-model="editPatient.address"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="editPatient.phone"
            placeholder="请输入电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input
            v-model="editPatient.id_card"
            placeholder="请输入身份证"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdatePatient"
            >更改</el-button
          >
          <el-button @click="editPatientDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加报告"
      v-model="createReportDialogVisible"
      width="800px"
    >
      <el-form label-position="right" label-width="100px">
        <el-form-item label="患者">
          <el-input
            v-model="report.patient"
            placeholder="请输入患者"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-button @click="triggerFileInput">上传图片</el-button>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            style="display: none"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreateReport">新建</el-button>
          <el-button @click="createReportDialogVisible = false">取消</el-button>
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
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/user";
const newPatient = ref({
  name: "",
  age: "",
  region: "",
  address: "",
  phone: "",
  id_card: "",
  gender: "",
});
const editPatient = ref({
  id: 0,
  name: "",
  age: "",
  region: "",
  address: "",
  phone: "",
  id_card: "",
  gender: "",
});
const report = ref({
  patient: 0,
});
var fileInput = ref(null);
const total_num = ref(0);
const current_page = ref(1);
const defaultPageSize = ref(10);
const XRayImage = ref(null);
const createReportDialogVisible = ref(false);
const editPatientDialogVisible = ref(false);
const nameFilter = ref("");
const ageFilter = ref("");
const genderFilter = ref("");
const regionFilter = ref("");
const addressFilter = ref("");
const patients = ref([]);
const selectedRows = ref([]);
const createDialogVisible = ref(false);
const handleCurrentChange = (val: number) => {
  current_page.value = val;
  fetchPatients();
};
const handleCreate = async () => {
  try {
    const response = await axiosInstance.post(
      "/patient/create/",
      newPatient.value
    );
    ElMessage({
      message: "新建成功",
      type: "success",
    });
    createDialogVisible.value = false;
    fetchPatients();
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
const fetchPatients = async () => {
  try {
    var params = {};
    params["size"] = defaultPageSize.value;
  if (nameFilter.value != "") {
    params["name"] = nameFilter.value;
  }
  if (ageFilter.value != "") {
    params["age"] = ageFilter.value;
  }
  if (genderFilter.value != "") {
    params["gender"] = genderFilter.value;
  }
  if (regionFilter.value != "") {
    params["region"] = regionFilter.value;
  }
  if (addressFilter.value != "") {
    params["address"] = addressFilter.value;
  }
    const response = await axiosInstance.get(
      "/patient/list/?p=" + current_page.value,
      {
        params: params,
      }
    );
    patients.value = response.data.results;
    total_num.value = response.data.count;
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
fetchPatients();

const handleSelectionChange = (val: any) => {
  selectedRows.value = val;
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
  fetchPatients();
};

const handleBatchDeleteAlert = () => {
  ElMessageBox.confirm("此操作将永久删除选中患者, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      handleBatchDelete();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};
const handleUpdatePatient = async () => {
  try {
    const response = await axiosInstance.patch(
      `/patient/detail/${editPatient.value.id}/`,
      editPatient.value
    );
    ElMessage({
      message: "更新成功",
      type: "success",
    });
    editPatientDialogVisible.value = false;
    fetchPatients();
  } catch (e) {
    ElMessage({
      message: "更新失败",
      type: "error",
    });
    console.error(e);
  }
};
const handleAddReport = (index: number, row: any) => {
  report.value.patient = row.id;
  createReportDialogVisible.value = true;
};

function triggerFileInput() {
  fileInput.value.click();
}
function handleFileUpload(event: any) {
  const uploadedFile = event.target.files[0];
  if (uploadedFile) {
    // 检查文件类型
    if (!["image/jpeg", "image/png", "image/gif"].includes(uploadedFile.type)) {
      alert("Invalid file type. Please upload an image file.");
      return;
    }
    XRayImage.value = uploadedFile;
  } else {
    ElMessage({
      message: "上传失败，重新上传",
      type: "error",
    });
  }
}
const handleCreateReport = async () => {
  try {
    const response = await axiosInstance.post("/report/create/", {
      patient: report.value.patient,
      X_ray: XRayImage.value,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
    ElMessage({
      message: "新建成功",
      type: "success",
    });
    createReportDialogVisible.value = false;
  } catch (e) {
    ElMessage({
      message: "新建失败",
      type: "error",
    });
    console.error(e);
  }
};
const handleCollect = async(index: number, row: any) => {
  try {
    const response = await axiosInstance.post(
      "/collect/create/",
      {
        patient: row.id,
        user: useUserStore().user.account,
      }
    );
    ElMessage({
      message: "收藏成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: "收藏失败,检查是否已经收藏了该患者",
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
}
#patientsList {
  height: 85%;
  padding: 10px;
  padding-bottom: 0;
}
#patientsHeader {
  height: 15%;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
