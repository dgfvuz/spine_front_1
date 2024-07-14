<template>
  <div id="xray-all">
    <!-- 这里做一个比较小的form -->
    <el-form :inline="true">
      <el-form-item label="姓名">
        <el-input v-model="nameFilter" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="fetchReport">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="xray">
      <el-card
        v-for="item in ReportDatas"
        style="height: 200px; overflow-y: auto"
      >
        <p>患者名称: {{ item.patient_name }}</p>
        <!-- <el-image
        style="width: 100px; height: 100px"
        :src="item.X_ray"
        fit="contain"
        /> -->
        <p>报告结果: {{ processResults(item.results) }}</p>
        <p>报告状态: {{ item.status }}</p>
        <p>更新时间: {{ item.update_time }}</p>
        <div>
          <el-button type="primary" @click="reportDetail(item)"
            >查看详情</el-button
          >
          <el-button type="primary" @click="handleRegenerate(item)"
            >重新生成</el-button
          >
          <el-button type="primary" @click="handleDelete(item)">删除</el-button>
        </div>
      </el-card>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="prev, pager, next"
      :total="totalNum"
      id="reportPagination"
    ></el-pagination>
  </div>
  <el-dialog
    title="报告详情"
    v-model="reportDetailVisiable"
    style="width: 100%; height: 100%; display: flex"
  >
    <el-image
      style="width: 100px; height: 100px"
      :src="selectedReport.X_ray"
      fit="contain"
    />
    <p>患者名称: {{ selectedReport.patient_name }}</p>
    <div>
      <span>报告结果:</span>
      <el-input v-model="selectedReport.result"></el-input>
      <div v-for="key in parts">
        <span>{{ key }}</span>
        <el-input v-model="selectedReport.results[key]['cobb']"></el-input>
      </div>
      <div v-for="key in others">
        <span>{{ key }}</span>
        <el-input v-model="selectedReport.results[key]"></el-input>
      </div>
    </div>
    <p>报告状态: {{ selectedReport.status }}</p>
    <p>更新时间: {{ selectedReport.update_time }}</p>
    <el-button type="primary" @click="handleUpdate">更新</el-button>
    <el-button type="primary" @click="reportDetailVisiable = false"
      >关闭</el-button
    >
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import axiosInstance from "@/http";
import { ElMessage } from "element-plus";
const ReportDatas = ref([]);
const totalNum = ref(0);
const selectedReport = ref(null);
const reportDetailVisiable = ref(false);
const currentPage = ref(1);
const nameFilter = ref("");
const parts = ref(["颈胸弯", "上胸弯", "胸弯", "胸弯2", "胸腰弯", "腰弯"]);
const others = ref([
  "冠状面平衡",
  "锁骨角",
  "csvl",
  "c7vl",
  "顶椎偏距",
  "胸廓躯干倾斜",
  "影像学肩高度",
  "胸1锥体倾斜角",
]);
const processResults = (results: any) => {
  var result = [];
  if (results === null) {
    return result;
  } else {
    if (results["颈胸弯"]["result"] !== "正常") {
      result.push(results["颈胸弯"]["cobb"]);
    }
    if (results["上胸弯"]["result"] !== "正常") {
      result.push(results["上胸弯"]["cobb"]);
    }
    if (results["胸弯"]["result"] !== "正常") {
      result.push(results["胸弯"]["cobb"]);
    }
    if (results["胸弯2"]["result"] !== "正常") {
      result.push(results["胸弯2"]["cobb"]);
    }
    if (results["胸腰弯"]["result"] !== "正常") {
      result.push(results["胸腰弯"]["cobb"]);
    }
    if (results["腰弯"]["result"] !== "正常") {
      result.push(results["腰弯"]["cobb"]);
    }
    return result;
  }
};
const fetchReport = async () => {
  try {
    const params = {
      p: currentPage.value,
      ...(nameFilter.value !== "" && { patient_name: nameFilter.value }),
    };
    const response = await axiosInstance.get("/report/list/", {
      params: params,
    });
    ReportDatas.value = response.data.results;
    totalNum.value = response.data.count;
  } catch (error) {
    ElMessage.error("获取报告失败");
  }
};
fetchReport();
const handleDelete = async (item: { id: string }) => {
  try {
    await axiosInstance.delete("/report/detail/" + item.id + "/");
    fetchReport();
    ElMessage.success("删除成功");
  } catch (error) {
    ElMessage.error("删除失败");
  }
};
const reportDetail = (item: any) => {
  selectedReport.value = item;
  reportDetailVisiable.value = true;
};
const handleRegenerate = async (item: { id: string }) => {
  try {
    await axiosInstance.post("/report/regenerate/" + item.id + "/");
    ElMessage.success("重新生成成功，请一段时间后刷新页面查看新报告");
  } catch (error) {
    ElMessage.error("重新生成失败");
  }
};
const handleUpdate = async () => {
  try {
    await axiosInstance.patch(
      "/report/detail/" + selectedReport.value.id + "/",
      {
        results: selectedReport.value.results,
        status: "已审核",
        result: selectedReport.value.result,
      }
    );
    fetchReport();
    ElMessage.success("更新成功");
  } catch (error) {
    ElMessage.error("更新失败");
  }
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchReport();
};
</script>

<style>
.xray {
  flex: 1;
  width: 100%;
  height: 95%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  overflow-y: auto;
}
#xray-all {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

#reportPagination {
  height: 5%;
  width: 100%;
}
</style>
