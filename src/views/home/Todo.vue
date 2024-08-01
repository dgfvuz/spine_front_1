<template>
  <div class="todo">
    <div class="dashboard">
      <div id="bar-chart"></div>
    </div>
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
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import axiosInstance from "@/http";
import { ElMessage } from "element-plus";
import router from "@/router";
import { onMounted, onUnmounted } from "vue";
import { CanvasRenderer } from "echarts/renderers";
// 引入 ECharts 主模块
import * as echarts from "echarts";

const option = ref({
  legend: {
    show: false,
  },
  tooltip: {},
  dataset: {
    // 提供一份数据。
    source: [
      ["类型", "数量"],
      ["今日新增患者", 100],
      ["今日新增报告", 200],
      ["今日未审核报告", 100],
    ],
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: "value", show: false },
  // 声明一个 Y 轴，数值轴。
  yAxis: {
    type: "category",
    axisLine: {
      show: false,
    },
  },
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [
    {
      type: "bar",
      grid: {
        top: "10%", // 增加上边距
        bottom: "100%", // 增加下边距
      },
      label: {
        show: true,
        position: "inside",
      },
      barCategoryGap: "20%",
      barGap: "5%",
      itemStyle: {
        color: function (params) {
          var colorlist = [
            "#E67716",
            "#FBC300",
            "#11440f",
            "#32585a",
            "#00ff77",
          ];
          return colorlist[params.dataIndex % 5];
        },
      },
    },
  ],
});

const initChart = () => {
  const chartDom = document.getElementById("bar-chart");
  const myChart = echarts.init(chartDom);
  myChart.setOption(option.value);
};

onMounted(() => {
  fetchData();
});
const ReportDatas = ref([]);
const totalNum = ref(0);
const currentPage = ref(1);
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
      status: "未审核",
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
const fetchData = async () => {
  const date = new Date();
  const formattedDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");
  date.setTime(date.getTime() + 86400000);
  const formattedDate1 =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");
  const response = await axiosInstance.get("/patient/list/", {
    params: {
      start_time: formattedDate,
      end_time: formattedDate1,
    },
  });
  option.value.dataset.source[1][1] = response.data.count;
  const response1 = await axiosInstance.get("/report/list/", {
    params: {
      start_time: formattedDate,
      end_time: formattedDate1,
    },
  });
  option.value.dataset.source[2][1] = response1.data.count;
  const response2 = await axiosInstance.get("/report/list/", {
    params: {
      status: "未审核",
      start_time: formattedDate,
      end_time: formattedDate1,
    },
  });
  option.value.dataset.source[3][1] = response2.data.count;
  initChart();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchReport();
};
</script>

<style>
.todo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.xray {
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  overflow-y: auto;
}

#reportPagination {
  width: 100%;
}
.dashboard {
  display: flex;
  width: 100%;
  height: 200px;
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
  height: 200px;
}
</style>
