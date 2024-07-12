<template>
  <div class="todo">
    <div class="dashboard">
      <div id="bar-chart"></div>
    </div>
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
import router from "@/router";
import { onMounted, onUnmounted } from "vue";
import {CanvasRenderer} from "echarts/renderers";
// 引入 ECharts 主模块
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

const initChart = () => {
  const chartDom = document.getElementById('bar-chart');
  const myChart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['今日新增患者数量', '今日新增报告数量']
    },
    series: [
      {
        type: 'bar',
        data: [120, 200],
        barWidth: '60%',
      }
    ]
  };
  myChart.setOption(option);
};


onMounted(() => {
  initChart();
});
const ReportDatas = ref([]);
const totalNum = ref(0);
const selectedReport = ref(null);
const reportDetailVisiable = ref(false);
const currentPage = ref(1);
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
    var params = {
      p: currentPage.value,
      status: "未审核"
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
.todo{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.xray {
  flex:1;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

#reportPagination {
  width:100%;
}
.dashboard {
  display: flex;
  width: 100%;
  height: 400px;
}
#gauge1 {
  width: 50%;
  height: 400px;
}
#gauge2 {
  width: 50%;
  height: 400px;
}
#bar-chart {
  width: 100%;
  height: 400px;
}
</style>
