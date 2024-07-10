<template>
  <div class="collect">
    <div id="collect-content">
      <el-table
        :data="patients"
        stripe
        id="collect-table"
        style="width: 100%; overflow: auto"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column
          prop="patient_name"
          label="姓名"
          width="80"
          fixed
        ></el-table-column>
        <el-table-column prop="patient_age" label="年龄" width="60"></el-table-column>
        <el-table-column
          prop="patient_gender"
          label="性别"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="patient_region"
          label="地区"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="patient_address"
          label="地址"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="patient_phone"
          label="电话"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="patient_id_card"
          label="身份证"
          width="170"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="patient_update_time"
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
                  <el-dropdown-item @click="handleBatchCancelCollect"
                    >取消收藏</el-dropdown-item
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
              @click="triggerFileInput(scope.$index, scope.row)"
              >添加报告</el-button
            >
            <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            style="display: none"
          />
            <el-button
              size="small"
              type="primary"
              @click="handlePatientReport(scope.$index, scope.row)"
              >查看所有报告</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleCancelCollect(scope.$index, scope.row)"
              >取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next" :total="total_num" /> -->
      <el-pagination
        layout="prev, pager, next"
        :total="total_num"
        :page-size="10"
        style="width:100%;text-align: right;"
        id="collect-pagination"
        @current-change="handleCurrentChange"
      />
    </div>
    
  </div>
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
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import { ArrowDown } from "@element-plus/icons-vue";
import { ElTable } from "element-plus";
import axiosInstance from "@/http";
import router from "@/router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/user";

const patients = ref([])
const total_num = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref([])
const fileInput = ref(null)
const report = ref({
  patient: 0,
  X_ray: null
})
const handleSelectionChange = (val:any) => {
  selectedRows.value = val
}
const editPatientDialogVisible = ref(false);
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
const triggerFileInput = (index: number, row: any) => {
  report.value.patient = row.id;
  fileInput.value.click();
};
const fetchPatients = async () => {
  var params = {
    user : useUserStore().user.account,
    p: currentPage.value,
    size : pageSize.value
  }
  try {
    const res = await axiosInstance.get('/collect/list/', {params: params})
    patients.value = res.data.results
    total_num.value = res.data.count
  } catch (error) {
    ElMessage({
      message: '获取病人列表失败',
      type: 'error'
    })
  }
}
fetchPatients()
const handleBatchCancelCollect = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage({
      message: '请选择要取消收藏的病人',
      type: 'warning'
    })
    return
  }
  for (let i = 0; i < selectedRows.value.length; i++) {
    try {
      await axiosInstance.delete(`/collect/detail/${selectedRows.value[i].id}/`)
      ElMessage({
        message: '取消收藏'+ selectedRows.value[i].name + '成功',
        type: 'success'
      })
      fetchPatients()
    } catch (error) {
      ElMessage({
        message: '取消收藏失败',
        type: 'error'
      })
  }
}
}
const handleEdit = (index: number, row: any) => {
  console.log("edit", index, row);
  editPatient.value.id = row.patient;
  editPatient.value.name = row.patient_name;
  editPatient.value.age = row.patient_age;
  editPatient.value.region = row.patient_region;
  editPatient.value.address = row.patient_address;
  editPatient.value.phone = row.patient_phone;
  editPatient.value.id_card = row.patient_id_card;
  editPatient.value.gender = row.patient_gender;
  editPatientDialogVisible.value = true;
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
const handleFileUpload = async (event: any) => {
  const uploadedFile = event.target.files[0];
  if (uploadedFile) {
    // 检查文件类型
    if (!["image/jpeg", "image/png", "image/gif"].includes(uploadedFile.type)) {
      alert("Invalid file type. Please upload an image file.");
      return;
    }
    report.value["X_ray"] = uploadedFile;
    try {
      await axiosInstance.post("/report/create/", report.value, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      ElMessage({
        message: "上传成功",
        type: "success",
      });
    } catch (error) {
      ElMessage({
        message: "上传失败，重新上传",
        type: "error",
      });
    }
  } else {
    ElMessage({
      message: "上传失败，重新上传",
      type: "error",
    });
  }
};
const handlePatientReport = (index: number, row: any) => {
  useUserStore().selectPatientId = row.patient;
  router.push("/default/patientXray");
};
const handleCancelCollect = async (index: number, row: any) => {
  try {
    await axiosInstance.delete(`/collect/detail/${row.id}/`)
    ElMessage({
      message: '取消收藏'+ row.name + '成功',
      type: 'success'
    })
    fetchPatients()
  } catch (error) {
    ElMessage({
      message: '取消收藏失败',
      type: 'error'
    })
  }
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchPatients()
}
</script>


<style>
.collect {
  height: 100%;
  width: 100%;
}
#collect-content {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
#collect-table {
  flex: 1;
}
#collect-pagination {
  margin-top: 10px;
}

</style>
