<template>
    <div class="xray">
      <el-card
        v-for="item in ReportDatas"
        style="height: 400px; overflow-y: auto"
      >
        <p>患者名称: {{ item.patient_name }}</p>
        <el-image
          style="width: 100px; height: 100px"
          :src="item.X_ray"
          fit="contain"
        />
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
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  import { useUserStore } from "@/stores/user";
  import axiosInstance from "@/http";
  import { ElMessage } from "element-plus";
  import router from "@/router";
  const ReportDatas = ref([]);
  const totalNum = ref(0);
  const currentPage = ref(1);
  const patientId = useUserStore().selectPatientId
  console.log("这是patientId", patientId)
  console.log("这是router", router)
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
      var params = {
        p: currentPage.value,
        patient: patientId,
      };
      console.log(params);
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
  if (item.status === "生成中") {
    ElMessage.error("报告生成中，无法查看详情");
    return;
  }
  useUserStore().selectedReport = item;
  router.push("/default/xrayDetail");
};
  const handleRegenerate = async (item: { id: string }) => {
    try {
      await axiosInstance.post("/report/regenerate/" + item.id + "/");
      ElMessage.success("重新生成成功，请一段时间后刷新页面查看新报告");
    } catch (error) {
      ElMessage.error("重新生成失败");
    }
  };
  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    fetchReport();
  };
  </script>
  
  <style>
  .xray {
    width: 100%;
    height: 95%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    overflow-y: auto;
  }
  
  #reportPagination {
    height: 5%;
    width:100%;
  }
  </style>
  